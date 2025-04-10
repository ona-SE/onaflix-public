# Streaming Platform Development Environment Demo

## Overview

This project demonstrates a Gitpod Flex development environment for a streaming platform, showcasing standardized, automated development environments for microservice architectures. It includes visualizations of service interactions and provides a hands-on demonstration of Gitpod's capabilities for seamless development setup.

## Architecture

The project consists of several interconnected components:

- **Frontend**: Interactive visualization of the streaming platform's service architecture
- **Backend Services**:
  - Content Catalog: Manages streaming content metadata
  - User Management: Handles user authentication and profiles
  - Recommendation Engine: Generates personalized content suggestions
  - Streaming Service: Manages video playback sessions
  - Analytics Service: Collects and analyzes platform metrics
- **Database**: SQLite database service that stores all platform data
- **Dev Container**: Standardized development environment configuration that ensures consistent setup across different machines

## Getting Started

### Prerequisites

- [Gitpod](https://www.gitpod.io/) account

### Quick Start

#### Using Gitpod

1. Click the button below to start a new Gitpod workspace:

   [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/loujaybee/flex-demo)

2. Gitpod will automatically set up the development environment and start all services
3. Access the streaming platform visualization at the automatically opened preview

#### Using VS Code Dev Containers

1. Install [VS Code](https://code.visualstudio.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Clone the repository
   ```
   git clone https://github.com/loujaybee/flex-demo.git
   cd flex-demo
   ```
3. Open the project in VS Code and click "Reopen in Container" when prompted
4. The devcontainer will automatically set up the environment and install dependencies
5. Start the services:
   ```
   cd services/database && npm run start
   ```
   ```
   cd services/backend && npm run dev
   ```
   ```
   cd frontend && npm run dev
   ```

#### Using DevContainers in Gitpod

Gitpod now supports DevContainers! You can use our DevContainer configuration in Gitpod by:

1. Opening the command palette in Gitpod (Ctrl+Shift+P or Cmd+Shift+P)
2. Selecting "Rebuild Container"
3. Wait for the container to rebuild with our DevContainer configuration

#### Troubleshooting DevContainer Issues

If you encounter issues with the DevContainer build:

1. **In Gitpod**: You can fall back to Gitpod's native containerization which is already configured in `.gitpod.yml`

2. **In VS Code**: 
   - Ensure Docker Desktop is running and has sufficient resources
   - Delete any cached images with `docker system prune` and try again
   - Try opening only the specific service you're working on in a container

### Manual Setup

If not using Gitpod:

1. Clone the repository
   ```
   git clone https://github.com/loujaybee/flex-demo.git
   cd flex-demo
   ```

2. Start database service
   ```
   cd services/database
   npm install
   npm run start
   ```
   This will create an SQLite database and seed it with sample data. You can access the database directly using SQLite tools:
   ```
   # Install SQLite if needed
   sqlite3 services/database/database.sqlite
   > .tables  # View all tables
   > SELECT * FROM Users;  # Query example
   ```

3. Start backend services
   ```
   cd services/backend
   npm install
   npm run dev
   ```

4. Start frontend
   ```
   cd frontend
   npm install
   npm run dev
   ```

## Development

### Project Structure

```
├── .devcontainer/      # VS Code Dev Container configuration
├── frontend/            # React-based visualization UI
├── services/
│   ├── backend/         # Express API services
│   │   ├── src/
│   │   │   ├── catalog/     # Content catalog service
│   │   │   ├── identity/    # User management service
│   │   │   ├── recommend/   # Recommendation engine
│   │   │   ├── stream/      # Streaming service
│   │   │   └── analytics/   # Analytics service
│   └── database/        # SQLite database service
├── .gitpod.yml         # Gitpod configuration
└── .gitpod.Dockerfile  # Gitpod container definition
```

### Testing

Run backend tests:
```
cd services/backend
npm test
```

Run frontend tests:
```
cd frontend
npm test
```

## Features

### Interactive Service Graph

- Visualize all microservices as interactive nodes
- See real-time data flow between services
- Zoom and pan to explore the architecture
- Click on nodes to view detailed service information

### Simulated Load Testing

- Generate increased traffic between services
- Visualize how services scale under load
- Monitor performance metrics in real-time

### Database Operations

- View streaming content record counts
- Visualize database operations
- Add and modify streaming content through the interface

## Built With

- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - API framework
- [SQLite](https://www.sqlite.org/) - Database
- [React](https://reactjs.org/) - Frontend framework
- [D3.js](https://d3js.org/) - Visualization library
- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - Real-time communication
- [Gitpod](https://www.gitpod.io/) - Cloud development environment
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) - Local development environment
