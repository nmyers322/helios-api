#!/bin/bash

# Deploy and Test Script for Helios API
# This script deploys the app and runs basic health checks

set -e

# Configuration
SECRETS_ENV="../helios-secrets/v2/.env"
SERVER_IP=${1:-$(grep -E '^SERVER_IP=' "$SECRETS_ENV" 2>/dev/null | cut -d '=' -f2)}
if [ -z "$SERVER_IP" ]; then
  SERVER_IP=$(grep -E '^SERVER_IP=' .env 2>/dev/null | cut -d '=' -f2)
fi
SSH_KEY="~/.ssh/helios.pem"

echo "🚀 Starting deployment with health checks..."

# Run the deployment
./scripts/deploy.sh $SERVER_IP

echo "🔍 Running health checks..."

# Test API endpoints
echo "Testing API health..."
curl -f -s http://$SERVER_IP/api/products > /dev/null && echo "✅ Products API: OK" || echo "❌ Products API: FAILED"

echo "Testing admin orders endpoint..."
curl -f -s -H "Accept: application/json" http://$SERVER_IP/api/admin/orders > /dev/null && echo "✅ Admin Orders API: OK" || echo "❌ Admin Orders API: FAILED"

echo "Testing static files..."
curl -f -s http://$SERVER_IP/helios-text-yellow-1000.png > /dev/null && echo "✅ Static files: OK" || echo "❌ Static files: FAILED"

# Check PM2 status remotely
echo "📊 Checking PM2 status on server..."
ssh -i $SSH_KEY ubuntu@$SERVER_IP "pm2 status"

echo "🎉 Deployment and health checks completed!"
echo "🌐 Application: http://$SERVER_IP"
echo "📱 Admin panel: http://$SERVER_IP/admin"
