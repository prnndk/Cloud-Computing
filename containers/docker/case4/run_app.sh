#!/bin/sh

# Hapus container lama jika ada
docker rm -f pyapp

echo "Menjalankan Aplikasi Python..."

docker run -dit \
    --name pyapp \
    --network mynet \
    -p 5000:5000 \
    -v "$(pwd)":/app \
    -w /app \
    python:3.9-slim \
    sh -c "pip install flask mysql-connector-python requests schedule && python app.py"
