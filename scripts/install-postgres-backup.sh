#!/bin/bash
# Install nightly Postgres dumps on the Helios app server.
# Usage (from helios-api in WSL): ./scripts/install-postgres-backup.sh

set -euo pipefail

SECRETS_ENV="../helios-secrets/v2/.env"
SERVER_IP=${1:-$(grep -E '^SERVER_IP=' "$SECRETS_ENV" 2>/dev/null | cut -d '=' -f2 || true)}
SSH_KEY="${HOME}/.ssh/helios.pem"
SSH_OPTS="-o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=30"
BACKUP_DIR="/opt/apps/shared/db-backups"
BACKUP_SCRIPT="/opt/apps/shared/db-backups/backup-helios-db.sh"

if [ -z "${SERVER_IP}" ]; then
  echo "SERVER_IP is required"
  exit 1
fi

ssh $SSH_OPTS -i "$SSH_KEY" ubuntu@"$SERVER_IP" bash -s <<'REMOTE'
set -euo pipefail
sudo mkdir -p /opt/apps/shared/db-backups
sudo chown -R ubuntu:ubuntu /opt/apps/shared/db-backups
sudo chmod 750 /opt/apps/shared/db-backups

cat > /opt/apps/shared/db-backups/backup-helios-db.sh <<'SCRIPT'
#!/bin/bash
set -euo pipefail
BACKUP_DIR="/opt/apps/shared/db-backups"
ENV_FILE="/opt/apps/helios-api/.env"
KEEP_DAYS=7
STAMP=$(date +%Y%m%d-%H%M%S)
if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi
set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a
DB_NAME="${DB_DATABASE:-${PG_DB:-helios-db}}"
DB_USER="${DB_USER:-${PG_USER:-helios}}"
DB_HOST="${DB_HOST:-${PG_HOST:-127.0.0.1}}"
DB_PORT="${DB_PORT:-${PG_PORT:-5432}}"
export PGPASSWORD="${DB_PASSWORD:-${PG_PASSWORD:-}}"
OUT="${BACKUP_DIR}/helios-db-${STAMP}.sql.gz"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --no-owner --no-acl | gzip > "$OUT"
find "$BACKUP_DIR" -name 'helios-db-*.sql.gz' -mtime +"${KEEP_DAYS}" -delete
echo "Wrote $OUT"
SCRIPT
chmod 750 /opt/apps/shared/db-backups/backup-helios-db.sh

CRON_LINE="30 2 * * * /opt/apps/shared/db-backups/backup-helios-db.sh >> /opt/apps/shared/db-backups/backup.log 2>&1"
(crontab -l 2>/dev/null | grep -v backup-helios-db.sh || true; echo "$CRON_LINE") | crontab -
/opt/apps/shared/db-backups/backup-helios-db.sh
ls -lh /opt/apps/shared/db-backups | tail
REMOTE
