#!/bin/bash
# Build script for Custom Nextcloud image

echo "Building Custom Nextcloud Image..."
echo "==================================="

docker build -t custom-nextcloud:1.0 .

echo ""
echo "Build complete!"
echo "Image: custom-nextcloud:1.0"
echo ""
echo "To run the container, use:"
echo "  cd ../runcontainer && ./run-nextcloud.sh"
