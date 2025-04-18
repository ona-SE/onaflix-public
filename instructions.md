# Gitpodflix Demo Project Specification

## Table of Contents

- [Project Overview](#project-overview)
- [Motivation](#motivation)
  - [The deliverable](#the-deliverable)
  - [In/Out of scope](#inout-of-scope)
- [Language and technologies](#language-and-technologies)
- [Directory Structure](#directory-structure)
- [Architecture Components](#architecture-components)
  - [Configuration files required](#configuration-files-required)
  - [Automation Services](#automation-services)
  - [Frontend Visualization Requirements](#frontend-visualization-requirements)
  - [Meta-Database for Development Environment Monitoring](#meta-database-for-development-environment-monitoring)
- [Implementation Steps](#implementation-steps)
  - [1. Set up the Development Container](#1-set-up-the-development-container)
  - [2. Set up the Database](#2-set-up-the-database)
  - [3. Build the Backend Services](#3-build-the-backend-services)
  - [4. Build the Frontend Applications](#4-build-the-frontend-applications)
  - [5. Set up Testing](#5-set-up-testing)
  - [6. Set up Automation](#6-set-up-automation)

## Project Overview

This repository serves as a unique, novel demonstration of Gitpod Flex, showcasing its powerful capabilities for creating standardized, automated development environments. The project uses a streaming platform (similar to Netflix) as an example use case, highlighting Gitpod's ability to configure complex microservice architectures and demonstrating how it can seamlessly set up and orchestrate a complete development stack with proper configuration and visualization across multiple interconnected services.

## Motivation

This demo addresses a critical gap in Gitpod's current demo capabilities. At present, Gitpod lacks a comprehensive Flex demo, which limits our ability to showcase the full potential to prospects and at events. We need more sophisticated, interactive demonstrations that go beyond the basic examples. This demo would serve as our "staple demo" - a core example that highlights the fundamental value proposition of Gitpod in a compelling way.

The primary purpose of this repository is to create a foundational demo that can replace the existing voting app demonstration used for Gitpod classic architecture. The demo is designed to be engaging, visually interesting, memorable with light humor and sufficiently complex to illustrate the power of Gitpod Flex across frontend, backend, and database applications. This demo will intentionally exclude more advanced use cases such as external infrastructure provisioning and installation steps including security/networking configurations.

### The deliverable

The deliverable will be a GitHub repository containing:

1. **Example microservice application(s)**: "Streaming platform" demo to showcase microservice architecture.
2. **Visualization**: An interactive view of microservices running in the development environment.
3. **Dev Container**: Include JSON specification for standardized environments.
4. **Automation files**: Include gitpod automation task/service definitions, initialization scripts, port configurations, etc.
5. **Demo script file**: Step-by-step instructions with talking points, visuals, and customization options.

### In/Out of scope

**In Scope**

- Impelementation of a dev container with complete JSON specification
- Implementation of Gitpod automation files that showcase microservice architecture in Gitpod
- Implementation of a simple, unique UI to visualize the microservices running in Gitpod
- Simple implementation of example microservices as demonstration components
- Frontend, backend, database, unit testing and seeding use cases covered
- Minimalist approach to keep the demo straightforward and focused

**Out of scope**

- Resource provisioning outside the development environment
- Data use cases and data processing pipelines
- Integration with external cloud services
- Performance optimization for production environments
- Runner installation use cases or security and networking

## Overview

The demo consists of several key components that work together to showcase Gitpod Flex's capabilities:

1. **Frontend**: A modern web application that visualizes the streaming platform's development environment configuration
2. **Backend**: API service that provides streaming platform data and functionality to the frontend
3. **Database (inside the box)**: Persistent storage for streaming platform data
4. **Unit Testing**: Automated test execution within the Gitpod environment
5. **Database Seeding**: Automated population of the database with sample streaming content data

## Language and technologies

- TypeScript/JavaScript/Node.js
- SQL (PostgreSQL)
- React.js
- D3.js
- Jest
- Git
- Docker
- ESLint
- Prettier

## Directory Structure

```
gitpodflix-demo/
├── .gitpod.yml
├── .devcontainer/
│   └── devcontainer.json
├── frontend/
│   ├── gitpodflix/           # Main streaming platform UI
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── dev-dashboard/        # Development environment visualization
│       ├── src/
│       ├── public/
│       └── package.json
├── backend/
│   ├── catalog/
│   │   ├── src/
│   │   └── package.json
│   ├── identity/
│   │   ├── src/
│   │   └── package.json
│   ├── recommend/
│   │   ├── src/
│   │   └── package.json
│   ├── stream/
│   │   ├── src/
│   │   └── package.json
│   ├── analytics/
│   │   ├── src/
│   │   └── package.json
│   └── monitoring/
│       ├── src/
│       └── package.json
├── database/
│   ├── main/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── docker-compose.yml
│   └── meta/
│       ├── migrations/
│       ├── seeds/
│       └── docker-compose.yml
├── tests/
│   ├── frontend/
│   ├── backend/
│   └── integration/
├── docs/
│   ├── demo-script.md
│   └── architecture.md
└── README.md
```

### Frontend Applications

#### Gitpodflix (Main Streaming Platform UI)

- Modern streaming platform interface similar to Netflix
- Features:
  - Content browsing and search
  - User profiles and watchlists
  - Content recommendations
  - Video playback interface
  - User authentication and preferences

#### Development Environment Dashboard

- Interactive graph-based visualization of the development environment with the following features:
  - Real-time visualization of services (content catalog, user management, recommendation engine, streaming service, analytics) as distinct, labeled nodes
  - Dynamic communication flow visualization between microservices with animated flow indicators showing direction and volume of data transfer
  - Visual representation of the database node showing streaming content record count and database operations (reads/writes)
  - Live updates showing database information changes with visual feedback when content records are added or modified
  - Visual tracking of request flows between different services with connection lines showing data flow
  - Interactive service dependency graph with zoom and pan capabilities for better navigation
  - Ability to inspect and click nodes to show detailed service information
  - Real-time updates of the graph as services start/stop
  - Ability to simulate increased streaming load to visualize scaling effects
  - Interactive database node allowing users to directly add/modify streaming content through the interface
- Data Source:
  - Powered by a dedicated meta-database that tracks all development environment activities
  - Each microservice automatically logs its communications with other services
  - Service-to-service requests are logged with timestamps and status
  - Transaction acknowledgments are recorded when services receive messages
  - Database operations are tracked and visualized in real-time
  - Main database state changes are reflected in the visualization
  - Service health metrics are continuously updated
  - Development environment metadata is persisted and displayed

## Implementation Steps

#### 1. Set up the Development Container

- Create a `.devcontainer` directory with `devcontainer.json` and `Dockerfile` configurations
- Use a Node.js base image with additional dependencies for PostgreSQL client, Docker CLI, and visualization libraries
- Configure VS Code extensions for:
  - JavaScript/TypeScript development
  - Docker management
  - Database tools
  - Git integration
  - ESLint and Prettier for code quality
- Set up environment variables for service connections and development settings
- Install development dependencies including:
  - React and visualization libraries (D3.js, vis.js)
  - Backend frameworks (Express, NestJS)
  - Database ORM tools
  - Testing frameworks
- Configure port forwarding for all microservices
- Set up volume mounts for persistent development data

#### 2. Set up the Database

##### Main Streaming Platform Database

- Create the database directory and configuration files
- Set up the PostgreSQL database container to store streaming platform data
- Create migration scripts for catalog schema (movies, TV shows, genres, actors)
- Develop seed scripts to populate the database with recognizable movie titles and TV shows
- Include popular titles across different genres (action, comedy, drama, sci-fi)
- Add metadata like release dates, ratings, cast information, and thumbnails
- Ensure data includes trending and recommended content for demo visualization

##### Meta-Database for Development Environment Monitoring

- Create a separate PostgreSQL instance for development environment monitoring
- Implement schema for service communication logs, transaction tracking, and database operations
- Create triggers and hooks in the main database to log operations and track changes
- Implement service middleware to log inter-service communications
- Track service health metrics including uptime, response times, and error rates
- Monitor database state changes and record counts
- Store development environment metadata like service versions and configurations

#### 3. Build the Backend Services

##### 3.1 Build the Content Catalog Service

- Create the service that manages movies and TV shows
- Set up how content is organized and tagged
- Add search and filtering features
- Handle content availability by region
- Rationale: This service is the core of content discovery, managing all metadata about available content and enabling search/filter functionality.

##### 3.2 Build the User Management Service

- Create the service that handles user accounts and permissions
- Set up user profiles and preferences
- Track what users watch and their watchlist
- Handle parental controls and content restrictions
- Rationale: This service manages all user-related data and access control, essential for personalized experiences and content recommendations.

##### 3.3 Build the Recommendation Service

- Create the service that suggests content to users
- Track what users watch and their patterns
- Set up how similar content is found
- Manage how recommendations stay fresh and varied
- Rationale: This service drives user engagement by providing personalized content suggestions based on viewing history and preferences.

##### 3.4 Build the Streaming Service

- Create the service that handles video playback
- Set up how video quality adjusts based on connection
- Track how well videos play
- Handle how videos are delivered to users
- Rationale: This service manages the actual video streaming experience, ensuring smooth playback and optimal quality based on network conditions.

##### 3.5 Build the Analytics Service

- Create the service that tracks user activity
- Monitor how well the streaming works
- Collect viewing statistics
- Generate reports about usage
- Rationale: This service provides insights into user behavior and system performance, helping improve the platform and user experience.

#### 4. Build the Frontend Applications

##### 4.1 Build Gitpodflix (Main Streaming Platform UI)

- Create the main streaming platform interface
- Implement core features:
  - Content browsing and search interface
  - User authentication and profile management
  - Content recommendation display
  - Video playback interface
  - Watchlist and favorites management
- Design a modern, Netflix-like UI with:
  - Responsive layout
  - Content carousels
  - Category browsing
  - Search functionality
  - User profile section
- Integrate with backend services:
  - Content catalog service
  - User management service
  - Recommendation service
  - Streaming service
- Implement real-time updates for:
  - Content availability
  - User preferences
  - Watch history
  - Recommendations

##### 4.2 Build Development Environment Dashboard

- Create the development environment visualization interface
- Implement core features:
  - Real-time service status monitoring
  - Interactive microservice architecture graph
  - Service communication visualization
  - Database operation monitoring
  - Development metrics dashboard
- Design an intuitive developer-focused UI with:
  - Interactive D3.js visualizations
  - Service health indicators
  - Communication flow diagrams
  - Database operation logs
  - Performance metrics
- Integrate with all backend services for:
  - Service status monitoring
  - Communication pattern tracking
  - Database operation logging
  - Performance metric collection
- Implement real-time updates for:
  - Service health status
  - Communication patterns
  - Database operations
  - Performance metrics

#### 5. Set up Testing

- **Unit Tests**

  - Create basic unit tests for each service:
    - Content Catalog: Test content search function
    - User Management: Test user authentication
    - Recommendation: Test recommendation generation
    - Streaming: Test video quality adaptation
    - Analytics: Test data collection

- **Integration Test**

  - Create a single end-to-end test that demonstrates the complete system flow:
    1. User logs in
    2. Searches for content
    3. Gets recommendations
    4. Starts streaming
    5. Verifies analytics are collected
  - This test will verify all services can communicate and work together

- **Testing Setup**
  - Use Jest as the testing framework
  - Set up test databases
  - Configure test coverage reporting

#### 6. Set up Automation

- Create Gitpod task configurations
- Set up service startup scripts
- Automate the development workflow
- Rationale: Automation is implemented last as it depends on all other components being properly configured and tested, ensuring smooth development experience.
