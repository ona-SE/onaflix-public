#!/bin/bash

set -e

echo "🚀 Starting OnaFlix Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to wait for service with timeout
wait_for_service() {
    local service_name=$1
    local check_command=$2
    local timeout=${3:-60}
    local interval=${4:-2}
    
    print_status "Waiting for $service_name to be ready..."
    
    for i in $(seq 1 $((timeout / interval))); do
        if eval "$check_command" >/dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        if [ $i -eq $((timeout / interval)) ]; then
            print_error "Timeout waiting for $service_name after ${timeout}s"
            return 1
        fi
        
        echo -n "."
        sleep $interval
    done
}

# Function to check if port is in use
check_port() {
    local port=$1
    if timeout 5 netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(timeout 5 netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 | head -1)
    if [ ! -z "$pid" ] && [ "$pid" != "-" ]; then
        print_warning "Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null || true
        sleep 2
    fi
}

# Step 1: Clean up any existing services
print_status "Cleaning up existing services..."

# Stop any existing Docker containers
docker stop main-postgres-1 2>/dev/null || true
docker rm main-postgres-1 2>/dev/null || true
docker stop postgres 2>/dev/null || true
docker rm postgres 2>/dev/null || true

# Kill processes on our ports
kill_port 3000
kill_port 3001
kill_port 5432

print_success "Cleanup completed"

# Step 2: Start PostgreSQL Database
print_status "Starting PostgreSQL database..."

cd database/main

# Ensure clean start - remove any stale containers
docker-compose down --remove-orphans 2>/dev/null || true
sleep 2

# Start PostgreSQL with retry logic
for attempt in 1 2 3; do
    print_status "Starting PostgreSQL (attempt $attempt/3)..."
    if docker-compose up -d; then
        break
    else
        print_warning "Failed to start PostgreSQL on attempt $attempt"
        if [ $attempt -eq 3 ]; then
            print_error "Failed to start PostgreSQL after 3 attempts"
            exit 1
        fi
        sleep 5
    fi
done

# Wait for PostgreSQL container to be healthy with extended timeout
print_status "Waiting for PostgreSQL container to be healthy..."
if ! wait_for_service "PostgreSQL Container" "docker-compose ps | grep postgres | grep -q 'healthy'" 180 3; then
    print_error "PostgreSQL container failed to become healthy"
    print_status "Container status:"
    docker-compose ps
    print_status "Container logs:"
    docker-compose logs postgres
    print_status "System resources:"
    docker system df
    exit 1
fi

# Wait for database connection to be ready with multiple verification steps
print_status "Waiting for PostgreSQL database connection..."
if ! wait_for_service "PostgreSQL Database Connection" "PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -c 'SELECT 1'" 90 2; then
    print_error "PostgreSQL database connection failed"
    print_status "Container status:"
    docker-compose ps
    print_status "Container logs:"
    docker-compose logs postgres
    print_status "Network connectivity test:"
    nc -zv localhost 5432 || true
    exit 1
fi

# Additional stability check - verify we can perform basic operations
print_status "Verifying database operations..."
if ! wait_for_service "Database Operations" "PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -c 'SELECT COUNT(*) FROM information_schema.tables'" 30 2; then
    print_error "Database operations verification failed"
    exit 1
fi

# Verify database schema is ready (migrations have run)
print_status "Verifying database schema..."
if ! wait_for_service "Database Schema" "PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -c 'SELECT 1 FROM information_schema.tables WHERE table_name = '\''movies'\'''" 30 2; then
    print_error "Database schema not ready - migrations may not have completed"
    docker-compose logs
    exit 1
fi

# Additional buffer time to ensure database is fully stable
print_status "Allowing database to stabilize..."
sleep 5

cd ../..

# Step 3: Install and start Backend Catalog Service
print_status "Setting up Backend Catalog Service..."

cd backend/catalog

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
DB_HOST=localhost
DB_USER=gitpod
DB_PASSWORD=gitpod
DB_NAME=gitpodflix
DB_PORT=5432
PORT=3001
EOF
fi

# Install dependencies
print_status "Installing backend dependencies..."
npm install

# Start the service in background
print_status "Starting catalog service..."
nohup npm run dev > /tmp/catalog.log 2>&1 &
CATALOG_PID=$!

# Wait for catalog service to be ready
if ! wait_for_service "Catalog Service" "curl -s http://localhost:3001/health" 30 2; then
    print_error "Catalog service failed to start"
    print_error "Logs:"
    tail -20 /tmp/catalog.log
    exit 1
fi

cd ../..

# Step 4: Install and start Frontend
print_status "Setting up Frontend..."

cd frontend

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

# Start the service in background
print_status "Starting frontend service..."
nohup npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to be ready
if ! wait_for_service "Frontend" "curl -s http://localhost:3000" 30 2; then
    print_error "Frontend failed to start"
    print_error "Logs:"
    tail -20 /tmp/frontend.log
    exit 1
fi

cd ..

# Step 5: Seed the database
print_status "Seeding database with sample data..."

# Verify database schema is ready for seeding
print_status "Verifying database schema for seeding..."
if ! wait_for_service "Database Schema Ready" "PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -c \"SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'movies'\" | grep -q '1'" 30 2; then
    print_error "Database schema not ready for seeding"
    exit 1
fi

# Check if database is already seeded
MOVIE_COUNT=$(PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -t -c "SELECT COUNT(*) FROM movies" 2>/dev/null | xargs || echo "0")
if [ "$MOVIE_COUNT" -gt 0 ]; then
    print_success "Database already contains $MOVIE_COUNT movies - skipping seeding"
else
    print_status "Database is empty, proceeding with seeding..."
    
    # Primary seeding method: SQL file
    if [ -f "database/main/seeds/movies_complete.sql" ]; then
        print_status "Seeding database from SQL file..."
        
        # Retry seeding with better error handling
        for seed_attempt in 1 2 3; do
            if PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -f database/main/seeds/movies_complete.sql 2>/tmp/seed_error.log; then
                # Verify seeding was successful
                NEW_MOVIE_COUNT=$(PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -t -c "SELECT COUNT(*) FROM movies" | xargs)
                if [ "$NEW_MOVIE_COUNT" -gt 0 ]; then
                    print_success "Database seeded with $NEW_MOVIE_COUNT movies from SQL file"
                    break
                else
                    print_warning "Seeding appeared successful but no movies found (attempt $seed_attempt/3)"
                fi
            else
                print_warning "SQL seeding failed on attempt $seed_attempt/3"
                if [ -f /tmp/seed_error.log ]; then
                    print_status "Seeding error details:"
                    cat /tmp/seed_error.log
                fi
            fi
            
            if [ $seed_attempt -eq 3 ]; then
                print_error "SQL seeding failed after 3 attempts, trying API fallback..."
                
                # API fallback seeding
                print_status "Attempting API seeding fallback..."
                if curl -s -X POST http://localhost:3001/api/movies/seed 2>/dev/null; then
                    sleep 2  # Give API time to complete seeding
                    FINAL_COUNT=$(PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -t -c "SELECT COUNT(*) FROM movies" | xargs)
                    if [ "$FINAL_COUNT" -gt 0 ]; then
                        print_success "Database seeded with $FINAL_COUNT movies via API fallback"
                    else
                        print_warning "API seeding completed but no movies found"
                    fi
                else
                    print_warning "API seeding also failed - database will be empty"
                fi
            else
                sleep 2  # Brief pause before retry
            fi
        done
    else
        print_status "SQL seed file not found, using API seeding..."
        if curl -s -X POST http://localhost:3001/api/movies/seed 2>/dev/null; then
            sleep 2
            API_COUNT=$(PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -t -c "SELECT COUNT(*) FROM movies" | xargs)
            if [ "$API_COUNT" -gt 0 ]; then
                print_success "Database seeded with $API_COUNT movies via API"
            else
                print_warning "API seeding completed but no movies found"
            fi
        else
            print_warning "API seeding failed - database will be empty"
        fi
    fi
fi

# Clean up temporary files
rm -f /tmp/seed_error.log 2>/dev/null || true

# Step 6: Final health checks
print_status "Performing final health checks..."

# Check PostgreSQL
if PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -c "SELECT COUNT(*) FROM movies" >/dev/null 2>&1; then
    MOVIE_COUNT=$(PGPASSWORD=gitpod psql -h localhost -U gitpod -d gitpodflix -t -c "SELECT COUNT(*) FROM movies" | xargs)
    print_success "PostgreSQL: ✅ ($MOVIE_COUNT movies in database)"
else
    print_error "PostgreSQL: ❌ Database connection failed"
fi

# Check Backend API
if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    print_success "Backend API: ✅ http://localhost:3001"
else
    print_error "Backend API: ❌ Not responding"
fi

# Check Frontend
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    print_success "Frontend: ✅ http://localhost:3000"
else
    print_error "Frontend: ❌ Not responding"
fi

# Step 7: Display summary
echo ""
echo "🎬 OnaFlix Environment Ready!"
echo "================================"
echo "Frontend:     http://localhost:3000"
echo "Backend API:  http://localhost:3001"
echo "Database:     PostgreSQL on port 5432"
echo ""
echo "Service PIDs:"
echo "- Catalog Service: $CATALOG_PID"
echo "- Frontend: $FRONTEND_PID"
echo ""
echo "Logs available at:"
echo "- Backend: /tmp/catalog.log"
echo "- Frontend: /tmp/frontend.log"
echo "- Database: docker logs main-postgres-1"
echo ""
print_success "All services are running successfully! 🚀"
