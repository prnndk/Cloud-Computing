# Custom Nextcloud Image - Built from Alpine Linux
# This is a completely custom build, not using official Nextcloud image

FROM alpine:3.18

LABEL maintainer="Cloud Computing Case 5"
LABEL description="Custom Nextcloud build from scratch on Alpine Linux"

# Set Nextcloud version
ENV NEXTCLOUD_VERSION=29.0.0
ENV PHP_MEMORY_LIMIT=512M
ENV PHP_UPLOAD_LIMIT=512M
ENV PHP_MAX_EXECUTION_TIME=300

# Install required packages
RUN apk update && apk add --no-cache \
    # Web server
    nginx \
    # PHP and required extensions for Nextcloud
    php82 \
    php82-fpm \
    php82-ctype \
    php82-curl \
    php82-dom \
    php82-fileinfo \
    php82-gd \
    php82-iconv \
    php82-intl \
    php82-json \
    php82-mbstring \
    php82-openssl \
    php82-pcntl \
    php82-pdo \
    php82-pdo_mysql \
    php82-pdo_sqlite \
    php82-phar \
    php82-posix \
    php82-session \
    php82-simplexml \
    php82-tokenizer \
    php82-xml \
    php82-xmlreader \
    php82-xmlwriter \
    php82-zip \
    php82-zlib \
    php82-opcache \
    php82-apcu \
    php82-bcmath \
    php82-gmp \
    php82-exif \
    php82-ftp \
    php82-pecl-imagick \
    php82-sodium \
    php82-sysvsem \
    php82-ldap \
    # Tools
    supervisor \
    curl \
    wget \
    bash \
    unzip \
    tar \
    gnupg \
    ca-certificates \
    openssl \
    ffmpeg \
    imagemagick \
    # For cron
    busybox-suid \
    && rm -rf /var/cache/apk/*

# Create symbolic link for php
RUN ln -sf /usr/bin/php82 /usr/bin/php

# Configure PHP
RUN sed -i "s/memory_limit = .*/memory_limit = ${PHP_MEMORY_LIMIT}/" /etc/php82/php.ini \
    && sed -i "s/upload_max_filesize = .*/upload_max_filesize = ${PHP_UPLOAD_LIMIT}/" /etc/php82/php.ini \
    && sed -i "s/post_max_size = .*/post_max_size = ${PHP_UPLOAD_LIMIT}/" /etc/php82/php.ini \
    && sed -i "s/max_execution_time = .*/max_execution_time = ${PHP_MAX_EXECUTION_TIME}/" /etc/php82/php.ini \
    && sed -i "s/max_input_time = .*/max_input_time = ${PHP_MAX_EXECUTION_TIME}/" /etc/php82/php.ini

# Configure PHP-FPM
RUN sed -i "s/;clear_env = no/clear_env = no/" /etc/php82/php-fpm.d/www.conf \
    && sed -i "s/user = nobody/user = nginx/" /etc/php82/php-fpm.d/www.conf \
    && sed -i "s/group = nobody/group = nginx/" /etc/php82/php-fpm.d/www.conf \
    && sed -i "s/listen = 127.0.0.1:9000/listen = \/var\/run\/php-fpm.sock/" /etc/php82/php-fpm.d/www.conf \
    && sed -i "s/;listen.owner = nobody/listen.owner = nginx/" /etc/php82/php-fpm.d/www.conf \
    && sed -i "s/;listen.group = nobody/listen.group = nginx/" /etc/php82/php-fpm.d/www.conf \
    && sed -i "s/;listen.mode = 0660/listen.mode = 0660/" /etc/php82/php-fpm.d/www.conf

# Download and install Nextcloud
RUN mkdir -p /var/www/html \
    && cd /tmp \
    && wget -q https://download.nextcloud.com/server/releases/nextcloud-${NEXTCLOUD_VERSION}.tar.bz2 \
    && wget -q https://download.nextcloud.com/server/releases/nextcloud-${NEXTCLOUD_VERSION}.tar.bz2.sha256 \
    && sha256sum -c nextcloud-${NEXTCLOUD_VERSION}.tar.bz2.sha256 \
    && tar -xjf nextcloud-${NEXTCLOUD_VERSION}.tar.bz2 -C /var/www/html --strip-components=1 \
    && rm -rf /tmp/nextcloud-${NEXTCLOUD_VERSION}.tar.bz2* \
    && chown -R nginx:nginx /var/www/html

# Create required directories
RUN mkdir -p /var/www/html/data \
    && mkdir -p /var/www/html/config \
    && mkdir -p /var/www/html/apps \
    && mkdir -p /var/log/nginx \
    && mkdir -p /var/log/php82 \
    && mkdir -p /run/nginx \
    && mkdir -p /var/run \
    && chown -R nginx:nginx /var/www/html \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /run/nginx \
    && chmod -R 755 /var/www/html

# Copy configuration files
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY php-fpm-www.conf /etc/php82/php-fpm.d/www.conf
COPY supervisord.conf /etc/supervisord.conf
COPY start.sh /start.sh
COPY nextcloud-cron.sh /nextcloud-cron.sh

# Make scripts executable
RUN chmod +x /start.sh /nextcloud-cron.sh

# Setup crontab for Nextcloud background jobs
RUN echo "*/5 * * * * /nextcloud-cron.sh" | crontab -

# Volumes for persistent data
VOLUME ["/var/www/html/data", "/var/www/html/config", "/var/www/html/apps"]

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost/status.php || exit 1

# Start services
ENTRYPOINT ["/start.sh"]
