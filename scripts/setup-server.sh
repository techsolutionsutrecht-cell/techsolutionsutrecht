#!/bin/bash

# Server setup script for initial deployment
# Run this script on your Hetzner server as root or with sudo

set -e

SERVER_IP="91.99.49.208"
DOMAIN="techsolutionsutrecht.nl"
PROJECT_DIR="/var/www/$DOMAIN"
GIT_REPO="your_github_username/your_repo_name.git" # UPDATE THIS!

echo "🚀 Setting up server for Tech Solutions Utrecht"

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose if not installed
if ! command -v docker compose &> /dev/null; then
    echo "🐳 Docker Compose plugin should be installed with Docker"
fi

# Install Git if not installed
if ! command -v git &> /dev/null; then
    echo "📦 Installing Git..."
    apt install -y git
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "🌐 Installing Nginx..."
    apt install -y nginx
fi

# Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
    echo "🔒 Installing Certbot..."
    apt install -y certbot python3-certbot-nginx
fi

# Create project directory
echo "📁 Creating project directory..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Clone repository (you'll need to set up SSH key or use HTTPS with token)
echo "📥 Cloning repository..."
echo "⚠️  Make sure you've set up SSH keys or access token!"
echo "Run: git clone git@github.com:$GIT_REPO ."
echo "Or run this script will try to clone..."
# git clone git@github.com:$GIT_REPO .

# Configure Nginx
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINX_CONF'
server {
    listen 80;
    server_name techsolutionsutrecht.nl www.techsolutionsutrecht.nl;

    location / {
        proxy_pass http://localhost:3007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_CONF

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

# Setup SSL with Let's Encrypt
echo "🔒 Setting up SSL certificate..."
echo "⚠️  Make sure DNS is pointing to this server before running certbot!"
echo "Run manually: certbot --nginx -d $DOMAIN -d www.$DOMAIN"

# Create Docker volume for database
echo "🗄️  Creating Docker volume for database..."
docker volume create postgres_data

echo ""
echo "✅ Server setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Clone your Git repository to $PROJECT_DIR"
echo "2. Create .env.production file based on .env.production.example"
echo "3. Run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "4. Run deployment script: bash scripts/deploy.sh"
echo ""
echo "🔑 Don't forget to set up GitHub Actions secrets:"
echo "   - SERVER_HOST: $SERVER_IP"
echo "   - SERVER_USER: root (or your SSH user)"
echo "   - SSH_PRIVATE_KEY: Your SSH private key"
