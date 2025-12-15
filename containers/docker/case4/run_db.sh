#!/bin/sh

docker network create mynet || true

docker rm -f mysql1

echo "Menjalankan Database MySQL..."
docker run -d \
    --name mysql1 \
    --network mynet \
    -e MYSQL_ROOT_PASSWORD=mysecretpassword \
    -e MYSQL_DATABASE=mydb \
    mysql:8.0-debian

docker rm -f phpmyadmin1

echo "Menjalankan phpMyAdmin..."
docker run -d \
    --name phpmyadmin1 \
    --network mynet \
    -p 10000:80 \
    -e PMA_HOST=mysql1 \
    -e MYSQL_ROOT_PASSWORD=mysecretpassword \
    phpmyadmin:5.2.1-apache