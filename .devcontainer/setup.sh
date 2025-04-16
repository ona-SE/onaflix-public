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
if ! command -v vite &> /dev/null; then
    npm install -g vite
else
    echo "✅ vite is already installed"
fi

# Install project dependencies
echo "📦 Installing project dependencies..."

# Function to install npm dependencies
install_npm_deps() {
    local dir=$1
    local name=$2
    echo "  📦 Installing $name dependencies..."
    if [ -d "$dir" ]; then
        cd "$dir"
        if [ -f "package.json" ]; then
            if [ ! -d "node_modules" ]; then
                npm install
            else
                echo "  ✅ $name dependencies are already installed"
            fi
        else
            echo "  ⚠️ No package.json found in $dir, skipping npm install"
        fi
    else
        echo "  ❌ Directory not found: $dir"
        exit 1
    fi
}

# Install dependencies for each project
install_npm_deps "/workspaces/flex-demo/management-ui" "Management UI"
install_npm_deps "/workspaces/flex-demo/frontend" "Gitpod Flix"
install_npm_deps "/workspaces/flex-demo/backend/catalog" "Catalog Service"
install_npm_deps "/workspaces/flex-demo/database" "Database Service"

echo "✅ Setup completed successfully!" 