#!/bin/bash
# Run script for Custom Nextcloud container

# Stop and remove existing container if exists
docker rm -f custom-nextcloud 2>/dev/null || true

echo "Starting Custom Nextcloud Container..."
echo "======================================="

# Create data directories if they don't exist
mkdir -p $(pwd)/../data/nextcloud-data
mkdir -p $(pwd)/../data/nextcloud-config
mkdir -p $(pwd)/../data/nextcloud-apps

# Run the container
docker run \
    -d \
    --name custom-nextcloud \
    -p 8888:80 \
    -v $(pwd)/../data/nextcloud-data:/var/www/html/data \
    -v $(pwd)/../data/nextcloud-config:/var/www/html/config \
    -v $(pwd)/../data/nextcloud-apps:/var/www/html/apps \
    --restart unless-stopped \
    custom-nextcloud:1.0

echo ""
echo "Container started successfully!"
echo ""
echo "Access Nextcloud at: http://localhost:8888"
echo ""
echo "First time setup:"
echo "  1. Create admin username and password"
echo "  2. Choose SQLite for simple setup, or configure MySQL/PostgreSQL"
echo "  3. Complete the installation wizard"
echo ""
echo "To view logs: docker logs -f custom-nextcloud"
echo "To stop: docker stop custom-nextcloud"
