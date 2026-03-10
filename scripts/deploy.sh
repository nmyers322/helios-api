#!/bin/bash

# Deploy Script for Helios API
# Usage: ./scripts/deploy.sh [SERVER_IP]

set -e

# Configuration
SECRETS_ENV="../helios-secrets/v2/.env"
SECRETS_REACT_ENV="../helios-secrets/v2/react/.env"
SERVER_IP=${1:-$(grep -E '^SERVER_IP=' "$SECRETS_ENV" 2>/dev/null | cut -d '=' -f2)}
if [ -z "$SERVER_IP" ]; then
    SERVER_IP=$(grep -E '^SERVER_IP=' .env 2>/dev/null | cut -d '=' -f2)
fi

SSH_KEY="~/.ssh/helios.pem"
SSH_OPTS="-o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=30"
APP_NAME="helios-api"

echo "🚀 Starting deployment to $SERVER_IP..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "adonisrc.ts" ]; then
    echo "❌ Error: Not in helios-api root directory"
    echo "Please run this script from the project root: ./scripts/deploy.sh"
    exit 1
fi

# Check if secrets directory exists
if [ ! -d "../helios-secrets" ]; then
    echo "❌ Error: helios-secrets directory not found"
    echo "Please ensure helios-secrets is cloned alongside helios-api"
    exit 1
fi

# Check if secrets env files exist
if [ ! -f "$SECRETS_ENV" ]; then
    echo "❌ Error: Missing secrets env file: $SECRETS_ENV"
    exit 1
fi

if [ ! -f "$SECRETS_REACT_ENV" ]; then
    echo "❌ Error: Missing secrets react env file: $SECRETS_REACT_ENV"
    exit 1
fi

if ! grep -q '^VITE_REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY=' "$SECRETS_ENV"; then
    echo "⚠️  Warning: VITE_REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY not found in $SECRETS_ENV"
fi

echo "📦 Building application..."
# Ensure we're using Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
node --version

echo "🔄 Building fresh"
npm run build -- --ignore-ts-errors
echo $(date +%s) > build/.build-timestamp

echo "📋 Copying configuration files..."
# Keep runtime envs in place for build + deploy
cp "$SECRETS_ENV" ./.env
cp "$SECRETS_REACT_ENV" inertia/app/.env
cp "$SECRETS_ENV" build/
cp "$SECRETS_REACT_ENV" build/inertia/app/
cp ecosystem.config.cjs build/

echo "🗜️ Creating deployment package..."
zip -r build.zip build

echo "📤 Uploading to server..."
scp $SSH_OPTS -i $SSH_KEY build.zip ubuntu@$SERVER_IP:/tmp/

echo "🔄 Deploying on server..."
ssh $SSH_OPTS -i $SSH_KEY ubuntu@$SERVER_IP << 'EOF'
    # Load NVM
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    # Variables
    APPS_DIR="/opt/apps"
    BUILD_ZIP="/tmp/build.zip"
    TIMESTAMP=$(date +%Y%m%d%H%M%S)
    RELEASE_DIR="$APPS_DIR/$TIMESTAMP"
    SYMLINK="$APPS_DIR/helios-api"

    echo "==> Creating timestamped release: $TIMESTAMP"
    sudo mkdir -p "$APPS_DIR"
    sudo unzip -q "$BUILD_ZIP" -d "$APPS_DIR"
    sudo mv "$APPS_DIR/build" "$RELEASE_DIR"

    echo "==> Setting permissions..."
    sudo chown -R ubuntu:ubuntu "$RELEASE_DIR"
    sudo chmod -R 755 "$RELEASE_DIR"

    echo "==> Installing dependencies..."
    cd "$RELEASE_DIR"
    npm ci --omit=dev

    echo "==> Updating symlink..."
    sudo ln -sfn "$RELEASE_DIR" "$SYMLINK"

    echo "==> Restarting application..."
    pm2 reload helios-api || pm2 start ecosystem.config.cjs

    echo "==> Cleaning up old releases..."
    # Keep current release + 2 previous releases (3 total)
    cd /opt/apps
    ls -1t | tail -n +4 | xargs -r sudo rm -rf
    echo "🧹 Cleaned up old releases (kept 3 most recent)"

    echo "==> Final cleanup..."
    rm -f "$BUILD_ZIP"

    echo "✅ Deployment complete!"
    echo "📊 Current status:"
    pm2 status
    echo "📁 Current release: $RELEASE_DIR"
    echo "📁 Available releases:"
    ls -la /opt/apps/ | grep "^d" | tail -4
EOF

# Clean up local build files
echo "🧹 Cleaning up local files..."
rm -rf build.zip

echo "🎉 Deployment completed successfully!"
echo "🌐 Application should be available at: http://$SERVER_IP"