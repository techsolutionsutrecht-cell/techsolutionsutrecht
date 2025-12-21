#!/bin/bash

# Quick status check script

PROJECT_DIR="/var/www/techsolutionsutrecht.nl"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Tech Solutions Utrecht - Status Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Project directory not found: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Check Docker containers
echo "🐳 Docker Containers:"
docker compose -f docker-compose.production.yml ps
echo ""

# Check Nginx status
echo "🌐 Nginx Status:"
systemctl status nginx --no-pager | head -n 5
echo ""

# Check SSL certificate
echo "🔒 SSL Certificate:"
if [ -f /etc/letsencrypt/live/techsolutionsutrecht.nl/fullchain.pem ]; then
    echo "✅ SSL certificate exists"
    openssl x509 -enddate -noout -in /etc/letsencrypt/live/techsolutionsutrecht.nl/fullchain.pem
else
    echo "❌ SSL certificate not found"
fi
echo ""

# Check disk usage
echo "💾 Disk Usage:"
df -h / | tail -n 1
echo ""

# Check recent logs
echo "📝 Recent Application Logs (last 10 lines):"
docker compose -f docker-compose.production.yml logs --tail=10 app
echo ""

# Check if site is accessible
echo "🌍 Website Status:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3007 | grep -q "200\|301\|302"; then
    echo "✅ Application is responding"
else
    echo "❌ Application is not responding"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
