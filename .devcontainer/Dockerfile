FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install Python and other dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    python3 \
    python3-pip \
    postgresql-client \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g typescript ts-node nodemon

# Install global Python packages
RUN pip3 install --no-cache-dir \
    pytest \
    black \
    flake8 \
    mypy

WORKDIR /workspace 