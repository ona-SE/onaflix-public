#!/bin/bash

set -e

echo "🚀 Starting development environment setup..."

# Install system dependencies
echo "📦 Installing system dependencies..."
sudo apt-get update && sudo apt-get install -y --no-install-recommends \
    postgresql-client \
    && sudo apt-get clean \
    && sudo rm -rf /var/lib/apt/lists/*

# Verify PostgreSQL client tools are installed
if ! command -v pg_isready &> /dev/null; then
    echo "❌ PostgreSQL client tools not properly installed"
    exit 1
fi

echo "✅ Setup completed successfully!" 

# GitHub CLI authentication (optional)
if [ -n "$GH_CLI_TOKEN" ]; then
    gh auth login --with-token <<< "$GH_CLI_TOKEN"
    gh auth setup-git
else
    echo "ℹ️  GH_CLI_TOKEN not set, skipping authentication"
fi
