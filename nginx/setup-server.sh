#!/bin/bash
set -e

echo "🚀 Setting up 97v.ru on this server"
echo "=================================="

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing nginx..."
    sudo apt update
    sudo apt install -y nginx
fi

# Create web directory
echo "📁 Creating web directory..."
sudo mkdir -p /var/www/97v.ru
sudo chown -R www-data:www-data /var/www/97v.ru

# Copy nginx config
echo "⚙️ Configuring nginx..."
sudo cp /tmp/97v.ru.conf /etc/nginx/sites-available/97v.ru
sudo ln -sf /etc/nginx/sites-available/97v.ru /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Install certbot for SSL
if ! command -v certbot &> /dev/null; then
    echo "🔒 Installing certbot..."
    sudo apt install -y certbot python3-certbot-nginx
fi

# Get SSL certificate
echo "🔒 Getting SSL certificate..."
sudo certbot --nginx -d 97v.ru -d www.97v.ru --non-interactive --agree-tos --email admin@97v.ru || echo "SSL will be configured later"

# Restart nginx
echo "🔄 Restarting nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

echo ""
echo "✅ Server setup complete!"
echo "📍 Web root: /var/www/97v.ru"
echo "🌐 Domain: https://97v.ru"
