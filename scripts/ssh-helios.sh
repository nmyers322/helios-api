#!/bin/bash

set -e

SECRETS_ENV="../helios-secrets/v2/.env"
SERVER_IP="$(grep -E '^SERVER_IP=' .env 2>/dev/null | cut -d '=' -f2)"
if [ -z "$SERVER_IP" ] && [ -f "$SECRETS_ENV" ]; then
  SERVER_IP="$(grep -E '^SERVER_IP=' "$SECRETS_ENV" | cut -d '=' -f2)"
fi

HOST="${1:-${SERVER_IP:-heliospressing.com}}"
USER="${2:-ubuntu}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/helios.pem}"
SSH_OPTS="-o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=30"

if [ ! -f "$SSH_KEY" ]; then
  echo "❌ SSH key not found: $SSH_KEY"
  echo "Set SSH_KEY or place helios.pem in ~/.ssh/"
  exit 1
fi

echo "🔐 Connecting to ${USER}@${HOST}..."
ssh $SSH_OPTS -i "$SSH_KEY" "${USER}@${HOST}"
