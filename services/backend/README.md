# Streaming Platform Backend Services

## Overview

This package contains the backend microservices for the Streaming Platform Demo. It provides APIs for content management, user authentication, recommendations, streaming, and analytics.

## Services

### 1. Content Catalog Service (Catalog)

Manages movie and TV show metadata including content categorization, search functionality, and regional availability.

**Key Features:**
- Content metadata management
- Search and filtering
- Genre categorization
- Regional content availability

### 2. User Management Service (Identity)

Handles user authentication, profile management, and content preferences.

**Key Features:**
- User authentication
- Profile management
- Preference tracking
- Watch history
- Parental controls

### 3. Recommendation Engine (Recommend)

Generates personalized content recommendations based on user preferences and viewing history.

**Key Features:**
- Personalized recommendations
- Viewing pattern tracking
- Content similarity calculation
- Recommendation freshness management

### 4. Streaming Service (Stream)

Manages video streaming sessions, including quality control and playback metrics.

**Key Features:**
- Streaming session management
- Adaptive bitrate handling
- Playback quality metrics
- CDN coordination

### 5. Analytics Service (Analytics)

Track user engagement and platform performance metrics.

**Key Features:**
- User engagement tracking
- Streaming performance monitoring
- Viewing statistics
- Usage reporting

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **WebSockets** - Real-time communication
- **SQLite** - Database (via the database service)
- **Jest** - Testing framework

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Database service running (SQLite-based)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start all services in development mode
npm run dev
```

The services will be available at http://localhost:8000 by default.

## API Documentation

### Content Catalog API

- `GET /api/catalog/status` - Get service status
- `GET /api/catalog/movies` - Get all movies
- `GET /api/catalog/movies/:id` - Get movie by ID
- `GET /api/catalog/shows` - Get all shows
- `GET /api/catalog/shows/:id` - Get show by ID
- `GET /api/catalog/search` - Search content by title or genre

### User Management API

- `GET /api/identity/status` - Get service status
- `GET /api/identity/users` - Get all users (admin only)
- `GET /api/identity/users/:id` - Get user by ID
- `POST /api/identity/auth/login` - Authenticate user
- `PUT /api/identity/users/:id/preferences` - Update user preferences
- `POST /api/identity/users/:id/history` - Update watch history

### Recommendation API

- `GET /api/recommend/status` - Get service status
- `GET /api/recommend/users/:userId` - Get recommendations for a user
- `POST /api/recommend/generate/:userId` - Generate new recommendations
- `GET /api/recommend/similarity/:contentId1/:contentId2` - Get similarity score

### Streaming API

- `GET /api/stream/status` - Get service status
- `GET /api/stream/sessions` - Get all active streams (admin only)
- `POST /api/stream/sessions` - Start a new streaming session
- `PUT /api/stream/sessions/:sessionId` - Update streaming metrics
- `DELETE /api/stream/sessions/:sessionId` - End streaming session
- `GET /api/stream/cdn/status` - Get CDN status

### Analytics API

- `GET /api/analytics/status` - Get service status
- `GET /api/analytics/engagement` - Get user engagement metrics
- `GET /api/analytics/content` - Get content performance metrics
- `GET /api/analytics/streaming` - Get streaming quality metrics
- `GET /api/analytics/regions` - Get regional data
- `POST /api/analytics/events` - Record analytics event

## WebSocket Communication

The backend provides a WebSocket server for real-time updates at `ws://localhost:8000`.

**Message Types:**

- `INIT` - Initial state with service nodes and connections
- `UPDATE` - Real-time updates to connections or nodes
- `SIMULATE_LOAD` - Client request to simulate increased load

## Testing

```bash
# Run tests
npm test
```

Tests are written using Jest and Supertest.

## Adding a New Service

To add a new microservice:

1. Create a new directory in `src/` with the service name
2. Create a `routes.js` file for the service API
3. Add the service routes to `index.js`
4. Add the service to the WebSocket server's `serviceNodes` object
5. Create tests for the new service in the `test/` directory