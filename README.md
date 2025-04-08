# Streaming Platform Demo

A demonstration of a streaming platform microservices architecture using Gitpod Flex. This project showcases how to set up and orchestrate a complete development stack with proper configuration and visualization across multiple interconnected services.

## Features

- Content Catalog Service
- User Management Service
- Recommendation Engine
- Streaming Service
- Analytics Service
- Interactive Service Visualization
- Real-time Service Monitoring

## Prerequisites

- Gitpod account
- Docker
- Node.js 18+
- Python 3.8+

## Getting Started

1. Clone this repository
2. Open in Gitpod
3. The development environment will be automatically configured
4. Run the following commands:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```
.
├── .devcontainer/          # Development container configuration
├── src/                    # Source code
│   ├── catalog/           # Content Catalog Service
│   ├── identity/          # User Management Service
│   ├── recommend/         # Recommendation Engine
│   ├── stream/            # Streaming Service
│   ├── analytics/         # Analytics Service
│   ├── visualization/     # Service Visualization
│   └── shared/            # Shared utilities
├── tests/                 # Test files
└── docs/                  # Documentation
```

## Services

### Content Catalog Service
Manages movie and TV show metadata, content categorization, and search functionality.

### User Management Service
Handles user authentication, profiles, and preferences.

### Recommendation Engine
Generates personalized content recommendations based on user behavior.

### Streaming Service
Manages video streaming sessions and quality.

### Analytics Service
Tracks user engagement and system performance metrics.

## Development

The project uses TypeScript for type safety and better developer experience. Each service is implemented as a microservice with its own API endpoints and database schema.

## Testing

Run tests with:

```bash
npm test
```

## License

MIT 