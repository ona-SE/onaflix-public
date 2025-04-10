FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-18

# Install SQLite
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends sqlite3 \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install global node packages
RUN npm install -g npm@latest typescript nodemon concurrently

WORKDIR /workspaces/flex-demo