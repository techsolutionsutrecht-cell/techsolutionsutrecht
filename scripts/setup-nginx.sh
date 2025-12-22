#!/bin/bash

# Script to setup Nginx with SSL for techsolutionsutrecht.nl
# Run this on your server

set -e

echo "🔧 Installing Nginx and Certbot..."
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

echo "📝 Copying Nginx configuration..."
sudo cp /var/www/techsolutionsutrecht/nginx/techsolutionsutrecht.nl.conf /etc/nginx/sites-available/techsolutionsutrecht.nl.conf

echo "🔗 Creating symbolic link..."
sudo ln -sf /etc/nginx/sites-available/techsolutionsutrecht.nl.conf /etc/nginx/sites-enabled/

echo "🗑️  Removing default Nginx site..."
sudo rm -f /etc/nginx/sites-enabled/default

echo "✅ Testing Nginx configuration..."
sudo nginx -t

echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "🔐 Obtaining SSL certificate..."
echo "⚠️  Make sure your domain DNS is pointing to this server!"
read -p "Press Enter to continue with SSL setup or Ctrl+C to cancel..."

sudo certbot --nginx -d techsolutionsutrecht.nl -d www.techsolutionsutrecht.nl --non-interactive --agree-tos --email your-email@example.com --redirect

echo "✅ SSL certificate installed successfully!"

echo "🔄 Final Nginx restart..."
sudo systemctl restart nginx

echo "✨ Setup complete!"
echo "Your site should now be available at: https://www.techsolutionsutrecht.nl"
echo ""
echo "📋 Next steps:"
echo "1. Test your site: https://www.techsolutionsutrecht.nl"
echo "2. SSL certificate will auto-renew"
echo "3. Check status: sudo systemctl status nginx"
