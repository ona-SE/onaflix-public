FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends sqlite3 jq httpie

# [Optional] Uncomment if you want to install more global node modules
RUN su node -c "npm install -g npm@latest typescript nodemon concurrently"

# Create workspace directory structure
RUN mkdir -p /home/node/workspace/logs \
    && mkdir -p /home/node/workspace/services/database \
    && mkdir -p /home/node/workspace/services/backend \
    && mkdir -p /home/node/workspace/frontend

# Set ownership for the node user
RUN chown -R node:node /home/node/workspace

WORKDIR /home/node/workspace