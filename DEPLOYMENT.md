# Helios API Deployment Guide

## Quick Start (Windows)

### Option 1: Interactive Menu
```cmd
deploy.bat
```
This will show you a menu with options.

### Option 2: Direct Commands
```cmd
deploy.bat setup    # First time setup
deploy.bat quick    # Quick deployment
deploy.bat test     # Deploy with health checks
deploy.bat check    # Check order 1033
```

## WSL Direct Commands

If you're already in WSL:

```bash
# First time setup
./scripts/setup-wsl-deploy.sh

# Quick deployment
./scripts/quick-deploy.sh

# Deploy with health checks
./scripts/deploy-and-test.sh

# Check specific order
./scripts/check-order-1033.sh
```

## Prerequisites

1. **SSH Key**: Ensure `~/.ssh/helios.pem` exists in WSL
2. **Secrets**: Clone `helios-secrets` alongside `helios-api`
3. **Server**: EC2 instance running at `3.21.33.187`

## What Each Script Does

### `quick-deploy.sh`
- Builds the application
- Copies environment files
- Uploads to server
- Deploys with zero-downtime
- Restarts PM2

### `deploy-and-test.sh`
- Runs quick deployment
- Tests API endpoints
- Checks PM2 status
- Verifies application health

### `check-order-1033.sh`
- Queries database for order 1033
- Shows customer information
- Checks recent logs
- Tests admin API response

### `setup-wsl-deploy.sh`
- Installs required tools
- Sets up Node.js/NVM
- Makes scripts executable
- Configures environment

## Server Information

- **IP**: 3.21.33.187
- **User**: ubuntu
- **SSH Key**: ~/.ssh/helios.pem
- **App Directory**: /opt/apps/helios-api
- **PM2 Process**: helios-api

## Troubleshooting

### SSH Connection Issues
```bash
# Test SSH connection
ssh -i ~/.ssh/helios.pem ubuntu@3.21.33.187 "echo 'Connection successful'"
```

### PM2 Issues
```bash
# Check PM2 status
ssh -i ~/.ssh/helios.pem ubuntu@3.21.33.187 "pm2 status"

# View logs
ssh -i ~/.ssh/helios.pem ubuntu@3.21.33.187 "pm2 logs helios-api"
```

### Database Issues
```bash
# Check order 1033 directly
ssh -i ~/.ssh/helios.pem ubuntu@3.21.33.187 "sudo -u postgres psql helios-db -c 'SELECT * FROM orders WHERE id = 1033;'"
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
7. **Cleanup**: Remove temporary files
