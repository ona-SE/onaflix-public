# Streaming Platform Frontend

## Overview

This is the frontend visualization component for the Streaming Platform Demo. It provides an interactive graph-based visualization of the streaming platform's development environment, showing service interactions and data flow in real-time.

## Features

- Interactive graph visualization of microservices
- Real-time updates of service-to-service communication
- Animated data flow between services
- Service details panel with metrics
- Ability to simulate increased load on services
- Zoom and pan capabilities for better navigation

## Tech Stack

- **React** - UI framework
- **D3.js** - Visualization library
- **WebSockets** - Real-time updates
- **Vite** - Build tool
- **TailwindCSS** - Styling

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The development server will start at http://localhost:3000 by default and will proxy API requests to the backend at port 8000.

### Building for Production

```bash
# Build the application
npm run build

# Preview the built application
npm run preview
```

## Project Structure

```
u251cu2500u2500 public/           # Static assets
u251cu2500u2500 src/
u2502   u251cu2500u2500 components/    # React components
u2502   u251cu2500u2500 hooks/         # Custom React hooks
u2502   u251cu2500u2500 App.jsx        # Main application component
u2502   u251cu2500u2500 main.jsx       # Entry point
u2502   u2514u2500u2500 styles.css     # Global styles
u251cu2500u2500 index.html       # HTML template
u251cu2500u2500 package.json     # Dependencies and scripts
u2514u2500u2500 vite.config.js   # Vite configuration
```

## Components

### GraphVisualization

The core visualization component that renders the service graph using D3.js. It handles:

- Node and link rendering
- Force-directed graph layout
- Interactive features (drag, zoom, click)
- Data flow animations

### ServiceDetails

Displays detailed information about a selected service, including:

- Service status
- Description
- Key metrics
- Service-specific actions

### Header

The application header with controls for:

- Simulating increased load on selected services
- Application title and description

## WebSocket Communication

The frontend communicates with the backend using WebSockets for real-time updates. The `useWebSocket` hook manages this connection and provides:

- List of service nodes
- Service connections
- Current connection status
- Function to simulate increased service load

## Testing

```bash
# Run tests
npm test
```

Tests are written using Vitest and React Testing Library.

## Customization

### Styling

The application uses TailwindCSS for styling. You can modify the styles in `src/styles.css`.

### Adding New Service Types

To add new service types to the visualization:

1. Update the backend services to include the new service
2. Assign a color to the new service in the `getNodeColor` function in `GraphVisualization.jsx`
3. Add service description and metrics in `ServiceDetails.jsx`