# DevContainer Best Practices

This guide covers best practices for configuring and iterating on your Gitpod DevContainer setup. It includes lessons learned from common issues and solutions for robust development environment configuration.

## What is a DevContainer?

A DevContainer (Development Container) is a Docker container that defines your development environment. In Gitpod, it's configured through:

- `.devcontainer/devcontainer.json`: Main configuration file
- `.devcontainer/Dockerfile`: Custom container image definition (optional)
- `.devcontainer/setup.sh`: Post-creation setup script

## Configuration Best Practices

### 1. Package Installation

- **Use Idempotent Installation**

  ```bash
  install_package() {
      local package=$1
      if ! dpkg -l | grep -q "^ii  $package "; then
          DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends "$package"
      fi
  }
  ```

- **Clean Cache Before Updates**

  ```bash
  apt-get clean
  apt-get update
  ```

- **Install Dependencies One by One**
  - This helps identify which package installation fails
  - Provides better error messages
  - Makes debugging easier

### 2. Service Management

- **Use `service` Instead of `systemctl`**

  - `systemctl` is not available in containers
  - Use `service` for managing services:
    ```bash
    service mariadb start
    service mariadb status
    ```

- **Verify Service Status**
  ```bash
  if ! service mariadb status > /dev/null 2>&1; then
      echo "❌ Failed to start MariaDB service"
      exit 1
  fi
  ```

### 3. NPM Dependencies

- **Check for Existing Installations**

  ```bash
  if ! command -v vite &> /dev/null; then
      npm install -g vite
  fi
  ```

- **Verify Directory Structure**
  ```bash
  if [ -d "$dir" ]; then
      cd "$dir"
      if [ -f "package.json" ]; then
          npm install
      fi
  fi
  ```

## Iterating with DevContainer

### 1. Rebuilding the Environment

```bash
# Rebuild the entire devcontainer
gitpod environment devcontainer rebuild

# View devcontainer logs
gitpod environment devcontainer logs | cat
```

### 2. Common Issues and Solutions

#### Package Installation Failures

- **Symptom**: `dpkg` errors with missing files
- **Solution**:
  - Clean apt cache before installation
  - Use `--no-install-recommends` to reduce dependencies
  - Install packages one by one

#### Service Management Issues

- **Symptom**: `systemctl` command not found
- **Solution**: Use `service` command instead
- **Example**:

  ```bash
  # Wrong
  systemctl start mariadb

  # Correct
  service mariadb start
  ```

#### NPM Installation Issues

- **Symptom**: Missing `package.json` or directory not found
- **Solution**: Add existence checks before installation
- **Example**:
  ```bash
  if [ -d "/workspaces/project/frontend" ]; then
      cd "/workspaces/project/frontend"
      if [ -f "package.json" ]; then
          npm install
      fi
  fi
  ```

### 3. Debugging Process

1. **Check Logs**

   ```bash
   gitpod environment devcontainer logs | cat
   ```

2. **Identify Error**

   - Look for exit codes
   - Check for specific error messages
   - Note which step failed

3. **Make Changes**

   - Update configuration files
   - Add error handling
   - Implement checks

4. **Rebuild and Test**
   ```bash
   gitpod environment devcontainer rebuild
   ```

## Example Configuration

### devcontainer.json

```json
{
  "name": "Development Environment",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "."
  },
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {
      "installZsh": true,
      "configureZshAsDefaultShell": true
    }
  },
  "postCreateCommand": "bash .devcontainer/setup.sh",
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
    }
  }
}
```

### setup.sh

```bash
#!/bin/bash
set -e

# Clean and update
apt-get clean
apt-get update

# Install packages
install_package() {
    local package=$1
    if ! dpkg -l | grep -q "^ii  $package "; then
        DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends "$package"
    fi
}

# Install system dependencies
install_package "mariadb-client"
install_package "mariadb-server"
install_package "postgresql-client"

# Start services
service mariadb start
if ! service mariadb status > /dev/null 2>&1; then
    echo "❌ Failed to start MariaDB service"
    exit 1
fi

# Install npm dependencies
install_npm_deps() {
    local dir=$1
    local name=$2
    if [ -d "$dir" ]; then
        cd "$dir"
        if [ -f "package.json" ]; then
            npm install
        fi
    fi
}

# Install project dependencies
install_npm_deps "/workspaces/project/frontend" "Frontend"
install_npm_deps "/workspaces/project/backend" "Backend"
```

## Best Practices Summary

1. **Error Handling**

   - Use `set -e` in scripts
   - Add status checks for services
   - Implement existence checks for files/directories

2. **Idempotency**

   - Check if packages are already installed
   - Verify service status before starting
   - Check for existing npm installations

3. **Debugging**

   - Use descriptive echo statements
   - Implement proper error messages
   - Check logs regularly

4. **Service Management**

   - Use `service` instead of `systemctl`
   - Verify service status after starting
   - Implement proper shutdown procedures

5. **Package Management**
   - Clean cache before updates
   - Install packages one by one
   - Use `--no-install-recommends` when possible
