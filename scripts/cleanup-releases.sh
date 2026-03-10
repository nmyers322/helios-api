#!/bin/bash

# Cleanup Old Releases Script for Helios API
# This script manually cleans up old releases, keeping only the specified number

set -e

# Configuration
SECRETS_ENV="../helios-secrets/v2/.env"
SERVER_IP=${1:-$(grep -E '^SERVER_IP=' "$SECRETS_ENV" 2>/dev/null | cut -d '=' -f2)}
if [ -z "$SERVER_IP" ]; then
    SERVER_IP=$(grep -E '^SERVER_IP=' .env 2>/dev/null | cut -d '=' -f2)
fi
SSH_KEY="~/.ssh/helios.pem"
KEEP_RELEASES=${2:-3}  # Default to keeping 3 releases (current + 2 previous)

echo "🧹 Starting cleanup of old releases on $SERVER_IP..."
echo "📋 Will keep $KEEP_RELEASES most recent releases"

# Execute cleanup on server
ssh -i $SSH_KEY ubuntu@$SERVER_IP << EOF
    echo "==> Current releases before cleanup:"
    ls -la /opt/apps/ | grep "^d" || echo "No releases found"
    
    echo ""
    echo "==> Cleaning up old releases (keeping $KEEP_RELEASES most recent)..."
    cd /opt/apps
    
    # Get total number of releases
    TOTAL_RELEASES=\$(ls -1t | wc -l)
    echo "Total releases found: \$TOTAL_RELEASES"
    
    if [ \$TOTAL_RELEASES -gt $KEEP_RELEASES ]; then
        RELEASES_TO_DELETE=\$((TOTAL_RELEASES - $KEEP_RELEASES))
        echo "Deleting \$RELEASES_TO_DELETE old release(s)..."
        
        # List and delete old releases
        ls -1t | tail -n +\$((KEEP_RELEASES + 1)) | while read release; do
            echo "  Deleting: \$release"
            sudo rm -rf "\$release"
        done
        
        echo "✅ Cleanup completed!"
    else
        echo "ℹ️  No cleanup needed (only \$TOTAL_RELEASES release(s) found)"
    fi
    
    echo ""
    echo "==> Remaining releases:"
    ls -la /opt/apps/ | grep "^d" || echo "No releases found"
    
    echo ""
    echo "==> Current symlink:"
    ls -la /opt/apps/current || echo "No current symlink found"
EOF

echo "🎉 Cleanup completed!"
