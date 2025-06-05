#!/bin/bash

set -e

npm run build
cp ../helios-secrets/v2/.env build/
cp ../helios-secrets/v2/react/.env build/inertia/app/
cp ecosystem.config.cjs build/
zip -r build.zip build
scp -i ~/.ssh/helios.pem build.zip ubuntu@$SERVER_IP:/tmp/
ssh -i ~/.ssh/helios.pem ubuntu@$SERVER_IP << EOF
    export NVM_DIR="\$HOME/.nvm"
    [ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"
    [ -s "\$NVM_DIR/bash_completion" ] && \. "\$NVM_DIR/bash_completion"

    # Variables
    APPS_DIR="/opt/apps"
    DEPLOY_USER="ubuntu"
    BUILD_ZIP="/tmp/build.zip"
    TIMESTAMP=\$(date +%Y%m%d%H%M%S)
    RELEASE_DIR="\$APPS_DIR/\$TIMESTAMP"
    SYMLINK="\$APPS_DIR/helios-api"

    echo "==> Unzipping build.zip to \$APPS_DIR..."
    sudo mkdir -p "\$APPS_DIR"
    sudo unzip -q "\$BUILD_ZIP" -d "\$APPS_DIR"

    echo "==> Moving build to \$RELEASE_DIR..."
    sudo mv "\$APPS_DIR/build" "\$RELEASE_DIR"

    echo "==> Setting ownership and permissions..."
    sudo chown -R \$DEPLOY_USER:\$DEPLOY_USER "\$RELEASE_DIR"
    sudo chmod -R 755 "\$RELEASE_DIR"

    echo "==> Installing production dependencies..."
    cd "\$RELEASE_DIR"
    npm ci --omit=dev

    echo "==> Updating symlink \$SYMLINK to point to \$RELEASE_DIR..."
    sudo ln -sfn "\$RELEASE_DIR" "\$SYMLINK"

    echo "==> Restarting PM2 app..."
    pm2 reload helios-api || pm2 start ecosystem.config.cjs

    echo "==> Cleaning up..."
    rm -f "\$BUILD_ZIP"

    echo "==> Deploy complete! Current release: \$RELEASE_DIR"
EOF

rm -rf build.zip