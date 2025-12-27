#!/bin/sh
# Nextcloud Cron Script
# Runs Nextcloud background jobs every 5 minutes

/usr/bin/php -f /var/www/html/cron.php 2>&1 | logger -t nextcloud-cron
