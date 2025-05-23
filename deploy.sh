#!/bin/bash

set -e

# Variables
APP_DIR="/home/ubuntu/helios-api"
DEPLOY_DIR="/opt/apps/helios-api"
ENV_FILE="$APP_DIR/.env"

echo "Pulling latest code..."
cd $APP_DIR
git pull

echo "Building app..."
npm install
npm run build

echo "Copying .env to build directory..."
cp $ENV_FILE $APP_DIR/build/.env

echo "Installing production dependencies in build..."
cd $APP_DIR/build
npm ci --omit=dev

echo "Deploying to $DEPLOY_DIR..."
rm -rf $DEPLOY_DIR
mv $APP_DIR/build $DEPLOY_DIR
chmod -R 755 $DEPLOY_DIR
chown -R www-data:www-data $DEPLOY_DIR

echo "Restarting PM2 app..."
cd $DEPLOY_DIR
pm2 restart helios-api

echo "Deployment complete!"
