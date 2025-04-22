#!/bin/bash

# Must be run from the root of the project
cd "$(dirname "$0")/.."

# Exit on error
set -e

# Variables
ENV_FILE_DIR="../helios-secrets/"

# Accept first argument for environment (test or prod)
if [ -z "$1" ]; then
  echo "Please provide an environment argument (test or prod)"
  read -p "Environment: " ENV
  if [ -z "$ENV" ]; then
    echo "Error: You must provide an environment argument (test or prod)"
    exit 1
  fi
else
  export ENV=$1
fi

# First argument must be either test or prod
if [ "$ENV" != "test" ] && [ "$ENV" != "prod" ]; then
  echo "Error: Invalid environment argument (test or prod)"
  exit 1
fi

# Set the node environment
export NODE_ENV=$ENV

# Source the environment variables from helios-env.sh
ENV_FILE="../helios-secrets/.env.$ENV"
if [ -f "$ENV_FILE" ]; then
  echo "========================================"
  echo "Sourcing environment variables from $ENV_FILE"
  . "$ENV_FILE"
  echo "========================================"
else
  ENV_FILE=".env.test"
fi

# Calculate checksum of package.json, package-lock.json, src directory, and build directory
CHECKSUM=$(find package.json package-lock.json src build -type f -exec sha256sum {} \; | sha256sum | awk '{print $1}')
CHECKSUM_FILE=".checksum"

# Check if checksum file exists and matches the current checksum
if [ -f "$CHECKSUM_FILE" ] && [ "$(cat $CHECKSUM_FILE)" == "$CHECKSUM" ]; then
  echo "========================================"
  echo "No changes detected, skipping npm install and npm build."
  echo "========================================"
else
  echo "========================================"
  echo "Changes detected, running npm install and npm build."
  echo "========================================"
  npm install
  npm run build
  echo $CHECKSUM > $CHECKSUM_FILE
fi

# Deploy the project using the environment and your password
echo "========================================"
echo "Deploying to $ENV"
echo "========================================"

# Set permissions on local files before uploading
chmod -R 755 build/

# Make sure the build directory exists on the server
ssh $MY_USER@$HOST << 'EOF'
  set -e
  mkdir -p /opt/apps/helios/wp-content/reactpress/apps/helios-react/new_build
EOF

# Upload local 'build' to server as 'new_build'
scp -r build/* $MY_USER@$HOST:/opt/apps/helios/wp-content/reactpress/apps/helios-react/new_build &
scp_pid=$!
wait $scp_pid

# Execute commands on the remote server
ssh $MY_USER@$HOST << 'EOF'
  set -e

  # Copy current 'build' to 'old_build'
  if [ -d /opt/apps/helios/wp-content/reactpress/apps/helios-react/build ]; then
    cp -r /opt/apps/helios/wp-content/reactpress/apps/helios-react/build /opt/apps/helios/wp-content/reactpress/apps/helios-react/old_build
  fi

  # Synchronize 'new_build' to 'build' and remove 'new_build'
  rsync -a --no-group --no-times --no-perms --delete /opt/apps/helios/wp-content/reactpress/apps/helios-react/new_build/ /opt/apps/helios/wp-content/reactpress/apps/helios-react/build/
  rm -rf /opt/apps/helios/wp-content/reactpress/apps/helios-react/new_build
EOF

echo "========================================"
echo "Deployed to $ENV successfully"
echo "========================================"

