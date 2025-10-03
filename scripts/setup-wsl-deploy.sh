#!/bin/bash

# WSL Deployment Setup Script
# Run this in WSL to set up your deployment environment

echo "🐧 Setting up WSL deployment environment for Helios API..."

# Check if we're in WSL
if [ ! -f /proc/version ] || ! grep -q Microsoft /proc/version; then
    echo "❌ This script should be run in WSL"
    exit 1
fi

# Update package list
echo "📦 Updating package list..."
sudo apt update

# Install required tools
echo "🔧 Installing required tools..."
sudo apt install -y curl git zip jq

# Install Node.js via NVM if not already installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js via NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 20
    nvm use 20
fi

# Make deployment scripts executable
echo "🔧 Making deployment scripts executable..."
chmod +x scripts/*.sh

# Check if SSH key exists
if [ ! -f ~/.ssh/helios.pem ]; then
    echo "⚠️  SSH key not found at ~/.ssh/helios.pem"
    echo "Please ensure your SSH key is in the correct location"
fi

# Check if secrets directory exists
if [ ! -d "../helios-secrets" ]; then
    echo "⚠️  helios-secrets directory not found"
    echo "Please clone it alongside helios-api:"
    echo "git clone https://github.com/nmyers322/helios-secrets.git"
fi

# Set up environment variables
echo "🔧 Setting up environment variables..."
echo 'export SERVER_IP="3.21.33.187"' >> ~/.bashrc
echo 'export HELIOS_API_DIR="/mnt/f/Workspace/helios/helios-api"' >> ~/.bashrc

echo "✅ WSL setup completed!"
echo ""
echo "🚀 You can now use these commands:"
echo "  ./scripts/quick-deploy.sh                    # Quick deployment"
echo "  ./scripts/deploy-and-test.sh                 # Deploy with health checks"
echo "  ./scripts/check-order-1033.sh                # Check specific order"
echo ""
echo "💡 To start deploying:"
echo "  1. Make sure you're in the helios-api directory"
echo "  2. Run: ./scripts/quick-deploy.sh"
