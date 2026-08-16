#!/bin/bash
set -euo pipefail

SECRETS_ENV="../helios-secrets/v2/.env"
SERVER_IP=${1:-$(grep -E '^SERVER_IP=' "$SECRETS_ENV" 2>/dev/null | cut -d '=' -f2 || true)}
SSH_KEY="${HOME}/.ssh/helios.pem"
SSH_OPTS="-o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=30"

if [ -z "${SERVER_IP}" ]; then
  echo "SERVER_IP is required"
  exit 1
fi

ssh $SSH_OPTS -i "$SSH_KEY" ubuntu@"$SERVER_IP" 'bash -s' <<'REMOTE'
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
get_env() {
  local key="$1"
  grep -E "^${key}=" "$ENV_FILE" | tail -1 | cut -d= -f2- | sed 's/^["'"'"']//;s/["'"'"']$//'
}
DB_NAME="$(get_env DB_DATABASE)"
DB_USER="$(get_env DB_USER)"
DB_HOST="$(get_env DB_HOST)"
DB_PORT="$(get_env DB_PORT)"
export PGPASSWORD="$(get_env DB_PASSWORD)"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
OUT="${BACKUP_DIR}/helios-db-${STAMP}.sql.gz"
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --no-owner --no-acl | gzip > "$OUT"
find "$BACKUP_DIR" -name 'helios-db-*.sql.gz' -mtime +"${KEEP_DAYS}" -delete
echo "Wrote $OUT"
SCRIPT
chmod 750 /opt/apps/shared/db-backups/backup-helios-db.sh

if ! command -v pg_dump >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql-client
fi

CRON_LINE="30 2 * * * /opt/apps/shared/db-backups/backup-helios-db.sh >> /opt/apps/shared/db-backups/backup.log 2>&1"
(crontab -l 2>/dev/null | grep -v backup-helios-db.sh || true; echo "$CRON_LINE") | crontab -
/opt/apps/shared/db-backups/backup-helios-db.sh
ls -lh /opt/apps/shared/db-backups
REMOTE
