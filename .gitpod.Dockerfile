FROM gitpod/workspace-full

# Install SQLite
RUN sudo apt-get update && sudo apt-get install -y sqlite3

# Install Node.js (using the default version in Gitpod)
RUN sudo apt-get update && sudo apt-get install -y \
    jq \
    httpie \
    && sudo rm -rf /var/lib/apt/lists/*

# Switch back to gitpod user
USER gitpod

# Install global npm packages
RUN npm install -g npm@latest typescript nodemon concurrently