FROM gitpod/workspace-full

# Install PostgreSQL
RUN sudo install-packages postgresql postgresql-contrib

# Install Node.js dependencies
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

# Install additional tools
RUN sudo apt-get update && sudo apt-get install -y \
    jq \
    httpie \
    redis-tools \
    && sudo rm -rf /var/lib/apt/lists/*

# Setup PostgreSQL server
RUN sudo mkdir -p /var/run/postgresql && \
    sudo chown gitpod:gitpod /var/run/postgresql

# Setup environment for running PostgreSQL
ENV PATH="$PATH:/usr/lib/postgresql/12/bin"
ENV PGDATA="/workspace/.pgsql/data"

# Switch back to gitpod user
USER gitpod

# Install global npm packages
RUN npm install -g npm@latest typescript nodemon concurrently