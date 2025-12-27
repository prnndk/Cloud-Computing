#!/bin/sh
# Nextcloud Custom Container Startup Script

set -e

echo "=========================================="
echo "   Custom Nextcloud Container Starting    "
echo "=========================================="

# Create required directories
echo "[*] Creating required directories..."
mkdir -p /var/www/html
mkdir -p /var/log/nginx
mkdir -p /var/log/php82
mkdir -p /run/nginx
mkdir -p /var/run

# Check if Nextcloud is installed in the volume
if [ ! -f /var/www/html/version.php ]; then
    echo "[*] Nextcloud not found in volume, copying from source..."
    rsync -rlD --delete /usr/src/nextcloud/ /var/www/html/
    echo "[*] Nextcloud files copied successfully"
else
    echo "[*] Nextcloud installation found in volume"
    
    # Check if there's a version mismatch and update if needed
    INSTALLED_VERSION=$(php -r "include '/var/www/html/version.php'; echo implode('.', \$OC_Version);" 2>/dev/null || echo "0.0.0.0")
    SOURCE_VERSION=$(php -r "include '/usr/src/nextcloud/version.php'; echo implode('.', \$OC_Version);" 2>/dev/null || echo "0.0.0.0")
    
    echo "[*] Installed version: $INSTALLED_VERSION"
    echo "[*] Source version: $SOURCE_VERSION"
    
    if [ "$INSTALLED_VERSION" != "$SOURCE_VERSION" ]; then
        echo "[*] Version mismatch detected, updating Nextcloud..."
        rsync -rlD --delete \
            --exclude /config/ \
            --exclude /data/ \
            --exclude /themes/ \
            --exclude /apps/ \
            /usr/src/nextcloud/ /var/www/html/
        echo "[*] Nextcloud updated"
    fi
fi

# Create required subdirectories
mkdir -p /var/www/html/data
mkdir -p /var/www/html/config
mkdir -p /var/www/html/apps
mkdir -p /var/www/html/themes

# Set proper permissions
echo "[*] Setting permissions..."
chown -R nginx:nginx /var/www/html
chown -R nginx:nginx /var/log/nginx
chown -R nginx:nginx /var/log/php82
chown -R nginx:nginx /run/nginx
chmod -R 0770 /var/www/html/data
chmod -R 0770 /var/www/html/config

# Create log files if they don't exist
touch /var/log/nginx/access.log
touch /var/log/nginx/error.log
touch /var/log/nginx/nextcloud.access.log
touch /var/log/nginx/nextcloud.error.log
touch /var/log/php82/php-fpm.log
touch /var/log/php82/php-fpm-error.log
touch /var/log/php82/error.log
touch /var/log/cron.log
touch /var/log/cron-error.log
touch /var/log/supervisord.log

chown nginx:nginx /var/log/nginx/*.log
chown nginx:nginx /var/log/php82/*.log

# Run occ commands if Nextcloud is configured
if [ -f /var/www/html/config/config.php ]; then
    echo "[*] Running maintenance tasks..."
    
    # Turn off maintenance mode if it's on
    su -s /bin/sh nginx -c "php /var/www/html/occ maintenance:mode --off" 2>/dev/null || true
    
    # Add missing indices
    su -s /bin/sh nginx -c "php /var/www/html/occ db:add-missing-indices" 2>/dev/null || true
    
    # Convert filecache bigint
    su -s /bin/sh nginx -c "php /var/www/html/occ db:convert-filecache-bigint --no-interaction" 2>/dev/null || true
    
    echo "[*] Maintenance tasks completed"
else
    echo "[*] Nextcloud not yet configured"
    echo "[*] Please access http://localhost and complete the setup wizard"
fi

echo "[*] Starting services with supervisor..."
echo "=========================================="
echo "   Nextcloud is starting...              "
echo "   Access: http://localhost              "
echo "=========================================="

# Start supervisor
exec /usr/bin/supervisord -n -c /etc/supervisord.conf
