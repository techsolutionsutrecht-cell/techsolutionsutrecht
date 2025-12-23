#!/bin/bash

# Deployment script for Tech Hub
# Usage: ./deploy.sh [server_ip]

set -e

SERVER_IP=${1:-"91.99.49.208"}
SERVER_USER="root"
PROJECT_DIR="/var/www/tech-hub"

echo "🚀 Starting deployment to $SERVER_IP..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  .env.production not found!"
    echo "📝 Creating from example..."
    cp .env.production.example .env.production
    echo "❌ Please edit .env.production with your production credentials first!"
    exit 1
fi

echo "📦 Creating deployment package..."
# Create a temporary directory for deployment
TMP_DIR=$(mktemp -d)
rsync -av --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '*.log' \
    --exclude '.env' \
    --exclude '.env.local' \
    . $TMP_DIR/

# Copy production env
cp .env.production $TMP_DIR/

echo "📤 Uploading to server..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $PROJECT_DIR"
rsync -avz --progress $TMP_DIR/ $SERVER_USER@$SERVER_IP:$PROJECT_DIR/

echo "🐳 Building and starting containers on server..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
cd /var/www/tech-hub

# Stop existing containers
docker compose -f docker-compose.prod.yml down || true

# Build and start
docker compose -f docker-compose.prod.yml up -d --build

# Wait for database
echo "⏳ Waiting for database..."
sleep 10

# Run migrations
echo "🔄 Running database migrations..."
docker compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy

# Show status
echo "📊 Container status:"
docker compose -f docker-compose.prod.yml ps

# Show logs
echo "📋 Application logs (last 50 lines):"
docker compose -f docker-compose.prod.yml logs --tail=50 app
EOF

# Cleanup
rm -rf $TMP_DIR

echo "✅ Deployment complete!"
echo "🌐 Application should be available at http://$SERVER_IP:3000"
echo "📋 To view logs: ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker compose -f docker-compose.prod.yml logs -f app'"
