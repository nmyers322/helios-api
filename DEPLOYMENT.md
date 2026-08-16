# Helios API Deployment Guide

## Quick Start (WSL Only)

### Single deployment entry point
Use this script for all deployments:

```bash
# Initial setup (run once)
./scripts/setup-wsl-deploy.sh --i-understand

# Deploy (single entry point)
./scripts/deploy.sh
```

## Prerequisites

1. **SSH Key**: Ensure `~/.ssh/helios.pem` exists in WSL
2. **Secrets**: Clone `helios-secrets` alongside `helios-api`
3. **Server IP**: Ensure `SERVER_IP` is set in `../helios-secrets/v2/.env`
4. **AWS Security Group**: Whitelist your current public IP for inbound TCP 22 before any SSH/deploy
   - See `../helios-secrets/aws.txt` for the exact AWS steps
5. **Template ZIPs (separate upload)**: Upload template ZIP files to `/opt/apps/shared/template-files` on the server.

### Template ZIP files (uploaded separately from app deploy)

`deploy.sh` now links each release's `public/template-files` to a shared path:

- Shared server path: `/opt/apps/shared/template-files`
- Release path: `/opt/apps/<timestamp>/public/template-files` (symlink)

This keeps template ZIP files out of the repo/build artifact so they are **not overwritten** on each deploy.

Initial setup / updates:

```bash
# Create persistent folder on server (run once)
SERVER_IP=$(grep -E '^SERVER_IP=' ../helios-secrets/v2/.env | cut -d '=' -f2)
ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP "sudo mkdir -p /opt/apps/shared/template-files && sudo chown -R ubuntu:ubuntu /opt/apps/shared && sudo chmod -R 755 /opt/apps/shared"

# Upload one or more template ZIPs
scp -i ~/.ssh/helios.pem ./Helios-Insert-INDESIGN.zip ubuntu@$SERVER_IP:/tmp/
ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP "mv /tmp/Helios-Insert-INDESIGN.zip /opt/apps/shared/template-files/"
```

If a template file is missing, the app intentionally returns `404` for that download.

### SSH key setup (new machine)

If the key is stored in `../helios-secrets/helios.pem`, copy it into your WSL user's SSH folder:

```bash
mkdir -p ~/.ssh
cp ../helios-secrets/helios.pem ~/.ssh/helios.pem
chmod 600 ~/.ssh/helios.pem
```

Notes:
- Deploy scripts expect the key at `~/.ssh/helios.pem`.
- `chmod 600` is required or SSH will reject the key as too open.
- Use the matching public key at `../helios-secrets/helios.pem.pub` when needed.

## What Each Script Does

### `deploy.sh`
- Builds the application
- Copies environment files
- Uploads to server
- Deploys with zero-downtime
- Restarts PM2
- **Automatically cleans up old releases** (keeps only 3 most recent)

### `deploy-and-test.sh`
- Runs `deploy.sh`
- Tests API endpoints
- Checks PM2 status
- Verifies application health

### `setup-wsl-deploy.sh` (initial setup)
- Installs required tools
- Sets up Node.js/NVM
- Makes scripts executable
- Configures environment
- Requires the `--i-understand` flag to run

### `cleanup-releases.sh`
- Manually clean up old releases
- Specify how many releases to keep (default: 3)
- Usage: `./scripts/cleanup-releases.sh [SERVER_IP] [KEEP_COUNT]`

## Server Information

- **IP Source**: `SERVER_IP` from `../helios-secrets/v2/.env`
- **User**: ubuntu
- **SSH Key**: ~/.ssh/helios.pem
- **App Directory**: /opt/apps/helios-api
- **PM2 Process**: helios-api

## Troubleshooting

### SSH Access (Security Group)
If SSH times out, ensure the EC2 security group allows inbound TCP 22 from your current public IP.
Follow the AWS notes in `../helios-secrets/aws.txt`.

### SSH Connection Issues
```bash
# Test SSH connection
SERVER_IP=$(grep -E '^SERVER_IP=' ../helios-secrets/v2/.env | cut -d '=' -f2)
ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP "echo 'Connection successful'"
```

### PM2 Issues
```bash
# Check PM2 status
SERVER_IP=$(grep -E '^SERVER_IP=' ../helios-secrets/v2/.env | cut -d '=' -f2)
ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP "pm2 status"

# View logs
ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP "pm2 logs helios-api"
```

### Database Issues
```bash
# Check order 1033 directly
SERVER_IP=$(grep -E '^SERVER_IP=' ../helios-secrets/v2/.env | cut -d '=' -f2)
ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP "sudo -u postgres psql helios-db -c 'SELECT * FROM orders WHERE id = 1033;'"
```

## Environment Files

The deployment automatically copies these files:
- `../helios-secrets/v2/.env` → `build/.env`
- `../helios-secrets/v2/react/.env` → `build/inertia/app/.env`
- `ecosystem.config.cjs` → `build/ecosystem.config.cjs`

## Deployment Process

1. **Build**: `npm run build`
2. **Package**: Create `build.zip`
3. **Upload**: SCP to `/tmp/build.zip`
4. **Deploy**: Extract to timestamped directory
5. **Symlink**: Update `/opt/apps/helios-api` symlink
6. **Restart**: PM2 reload
7. **Cleanup**: Remove old releases (keeps only 3 most recent)
8. **Final Cleanup**: Remove temporary files

## Test Instructions

Run tests from `helios-api`:

```bash
# Required before every deploy
node ace test unit

# Run all functional tests
npm test -- functional

# Run all tests
npm test
```

`./scripts/deploy.sh` runs `node ace test unit` and aborts if it fails.

Current tests:
- `tests/unit/quote_display.spec.ts` (pricing display / weight fold / admin list state)
- `tests/unit/package_deals.spec.ts` (advertised-price discount, package matching, CTA/display helpers)
- `tests/functional/root_domain.spec.ts` (included when running `npm test -- functional`)

## Postgres backups

The app server did not have a nightly `helios-db` dump. Install one (keeps ~7 days under `/opt/apps/shared/db-backups`):

```bash
./scripts/install-postgres-backup.sh
```

This writes a dump immediately so you can confirm a `.sql.gz` file exists, then schedules ubuntu cron at 02:30.
