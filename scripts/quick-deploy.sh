#!/bin/bash

# Quick Deploy Script for Helios API
# Usage: ./scripts/quick-deploy.sh [SERVER_IP]

set -e

# Configuration
SERVER_IP=${1:-$(grep SERVER_IP .env | cut -d '=' -f2)}  # Use SERVER_IP from .env or override
SSH_KEY="~/.ssh/helios.pem"
APP_NAME="helios-api"

echo "🚀 Starting quick deployment to $SERVER_IP..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "adonisrc.ts" ]; then
    echo "❌ Error: Not in helios-api root directory"
    echo "Please run this script from the project root: ./scripts/quick-deploy.sh"
    exit 1
fi

# Check if secrets directory exists
if [ ! -d "../helios-secrets" ]; then
    echo "❌ Error: helios-secrets directory not found"
    echo "Please ensure helios-secrets is cloned alongside helios-api"
    exit 1
fi

echo "📦 Building application..."
# Ensure we're using Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20
node --version

# Check if build directory exists and is recent (within 5 minutes)
if [ -d "build" ] && [ -f "build/.build-timestamp" ]; then
    BUILD_TIME=$(cat build/.build-timestamp)
    CURRENT_TIME=$(date +%s)
    TIME_DIFF=$((CURRENT_TIME - BUILD_TIME))
    
    if [ $TIME_DIFF -lt 300 ]; then
        echo "⚡ Using cached build (built $(($TIME_DIFF))s ago)"
    else
        echo "🔄 Building fresh (cache expired)"
        npm run build -- --ignore-ts-errors
        echo $(date +%s) > build/.build-timestamp
    fi
else
    echo "🔄 Building fresh (no cache)"
    npm run build -- --ignore-ts-errors
    echo $(date +%s) > build/.build-timestamp
fi

echo "📋 Copying configuration files..."
cp ../helios-secrets/v2/.env build/
cp ../helios-secrets/v2/react/.env build/inertia/app/
cp ecosystem.config.cjs build/

echo "🗜️ Creating deployment package..."
zip -r build.zip build

echo "📤 Uploading to server..."
scp -i $SSH_KEY build.zip ubuntu@$SERVER_IP:/tmp/

echo "🔄 Deploying on server..."
ssh -i $SSH_KEY ubuntu@$SERVER_IP << 'EOF'
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
