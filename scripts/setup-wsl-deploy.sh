#!/bin/bash

# WSL Deployment Setup Script
# Initial setup only — requires explicit acknowledgement

echo "🐧 Initial setup for WSL deployment environment..."

# Require explicit acknowledgement to avoid accidental runs
if [ "$1" != "--i-understand" ]; then
    echo "❌ Refusing to run without acknowledgement."
    echo "This script is for initial setup only and should be run once."
    echo ""
    echo "Run with:"
    echo "  ./scripts/setup-wsl-deploy.sh --i-understand"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "adonisrc.ts" ]; then
    echo "❌ Error: Not in helios-api root directory"
    echo "Please run this script from the project root:"
    echo "  ./scripts/setup-wsl-deploy.sh --i-understand"
    exit 1
fi

# Check if we're in WSL
if [ ! -f /proc/version ] || ! grep -qiE 'microsoft|wsl' /proc/version /proc/sys/kernel/osrelease 2>/dev/null; then
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
if ! grep -q 'export SERVER_IP=' ~/.bashrc; then
    echo 'export SERVER_IP="3.21.33.187"' >> ~/.bashrc
fi

HELIOS_API_DIR="$(pwd)"
if ! grep -q 'export HELIOS_API_DIR=' ~/.bashrc; then
    echo "export HELIOS_API_DIR=\"$HELIOS_API_DIR\"" >> ~/.bashrc
fi

echo "✅ Initial setup completed!"
echo ""
echo "🚀 You can now use these commands:"
echo "  ./scripts/deploy.sh                          # Deploy (single entry point)"
echo "  ./scripts/deploy-and-test.sh                 # Deploy with health checks"
echo ""
echo "💡 To start deploying:"
echo "  1. Make sure you're in the helios-api directory"
echo "  2. Run: ./scripts/deploy.sh"
