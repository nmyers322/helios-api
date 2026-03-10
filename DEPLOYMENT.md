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
