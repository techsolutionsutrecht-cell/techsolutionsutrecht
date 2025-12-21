#!/bin/bash

# Deployment script for Tech Solutions Utrecht
# This script should be run on the server

set -e

PROJECT_DIR="/var/www/techsolutionsutrecht.nl"
COMPOSE_FILE="docker-compose.production.yml"

echo "🚀 Starting deployment..."

# Navigate to project directory
cd "$PROJECT_DIR" || exit 1

# Pull latest changes
echo "📦 Pulling latest changes from Git..."
git pull origin main || git pull origin master

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production based on .env.production.example"
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose -f "$COMPOSE_FILE" down

# Build and start new containers
echo "🔨 Building and starting containers..."
docker compose -f "$COMPOSE_FILE" up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run database migrations
echo "🗄️  Running database migrations..."
docker compose -f "$COMPOSE_FILE" exec -T app npx prisma migrate deploy

# Check if containers are running
echo "✅ Checking container status..."
docker compose -f "$COMPOSE_FILE" ps

# Clean up unused Docker resources
echo "🧹 Cleaning up..."
docker system prune -f

echo "✅ Deployment completed successfully!"
echo "🌐 Application should be available at: https://techsolutionsutrecht.nl"
