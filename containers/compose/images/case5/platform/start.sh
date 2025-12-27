#!/bin/sh
# Nextcloud Custom Container Startup Script

set -e

echo "=========================================="
echo "   Custom Nextcloud Container Starting    "
echo "=========================================="

# Create required directories if they don't exist
echo "[*] Creating required directories..."
mkdir -p /var/www/html/data
mkdir -p /var/www/html/config
mkdir -p /var/www/html/apps
mkdir -p /var/log/nginx
mkdir -p /var/log/php82
mkdir -p /run/nginx
mkdir -p /var/run

# Set proper permissions
echo "[*] Setting permissions..."
chown -R nginx:nginx /var/www/html
chown -R nginx:nginx /var/log/nginx
chown -R nginx:nginx /var/log/php82
chmod -R 755 /var/www/html

# Create log files if they don't exist
touch /var/log/nginx/access.log
touch /var/log/nginx/error.log
touch /var/log/php82/php-fpm.log
touch /var/log/php82/php-fpm-error.log
touch /var/log/php82/error.log
touch /var/log/cron.log
touch /var/log/cron-error.log
touch /var/log/supervisord.log

# Check if Nextcloud is installed
if [ ! -f /var/www/html/config/config.php ]; then
    echo "[*] Nextcloud not yet configured"
    echo "[*] Please access http://localhost and complete the setup wizard"
else
    echo "[*] Nextcloud configuration found"
    
    # Run occ upgrade if needed
    if [ -f /var/www/html/occ ]; then
        echo "[*] Checking for Nextcloud updates..."
        su -s /bin/sh nginx -c "php /var/www/html/occ upgrade" || true
        su -s /bin/sh nginx -c "php /var/www/html/occ db:add-missing-indices" || true
        su -s /bin/sh nginx -c "php /var/www/html/occ maintenance:mode --off" || true
    fi
fi

echo "[*] Starting services with supervisor..."
echo "=========================================="
echo "   Nextcloud is starting...              "
echo "   Access: http://localhost              "
echo "=========================================="

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
