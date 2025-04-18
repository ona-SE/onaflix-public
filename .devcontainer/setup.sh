#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting development environment setup..."

# Function to handle package installation
install_package() {
    local package=$1
    echo "📦 Installing $package..."
    if ! dpkg -l | grep -q "^ii  $package "; then
        DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends "$package"
    else
        echo "✅ $package is already installed"
    fi
}

# Clean apt cache and update package lists
echo "🧹 Cleaning apt cache..."
apt-get clean
echo "🔄 Updating package lists..."
apt-get update

# Install system dependencies one by one with error handling
echo "📦 Installing system dependencies..."
install_package "mariadb-client"
install_package "mariadb-server"
install_package "postgresql-client"

# Verify PostgreSQL client tools are installed
if ! command -v pg_isready &> /dev/null; then
    echo "❌ PostgreSQL client tools not properly installed"
    exit 1
fi

# Start MariaDB service
echo "💾 Starting MariaDB service..."
if ! service mariadb status > /dev/null 2>&1; then
    service mariadb start
else
    echo "✅ MariaDB service is already running"
fi

# Verify MariaDB is running
if ! service mariadb status > /dev/null 2>&1; then
    echo "❌ Failed to start MariaDB service"
    exit 1
fi

# Install global npm packages
echo "📦 Installing global npm packages..."
npm install -g nodemon

# Install project dependencies
echo "📦 Installing project dependencies..."

# Install Gitpod Flix dependencies
if [ -d "/workspaces/gitpodflix-demo/frontend" ]; then
    echo "📦 Installing Gitpod Flix dependencies..."
    cd /workspaces/gitpodflix-demo/frontend
    npm install
fi

# Install catalog service dependencies
if [ -d "/workspaces/gitpodflix-demo/backend/catalog" ]; then
    echo "📦 Installing catalog service dependencies..."
    cd /workspaces/gitpodflix-demo/backend/catalog
    npm install
fi

echo "✅ Setup completed successfully!" 
