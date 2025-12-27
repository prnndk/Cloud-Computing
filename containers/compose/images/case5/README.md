# Case 5 - Custom Nextcloud Image

Aplikasi Nextcloud yang dibangun dari scratch menggunakan Alpine Linux dengan Dockerfile custom.

## 🚀 Deskripsi

Case ini mendemonstrasikan cara membuat image Docker custom untuk Nextcloud **dari nol**, tanpa menggunakan image official Nextcloud. Image dibangun di atas Alpine Linux dengan:

- **Web Server**: Nginx
- **PHP**: PHP 8.2 dengan semua extension yang diperlukan Nextcloud
- **Process Manager**: Supervisor untuk mengelola multiple services
- **Background Jobs**: Cron untuk background tasks

## 📁 Struktur Folder

```
case5/
├── platform/                    # Folder untuk build image
│   ├── Dockerfile              # Custom Dockerfile dari Alpine
│   ├── nginx.conf              # Konfigurasi Nginx untuk Nextcloud
│   ├── php-fpm-www.conf        # Konfigurasi PHP-FPM
│   ├── supervisord.conf        # Konfigurasi Supervisor
│   ├── start.sh                # Script startup container
│   ├── nextcloud-cron.sh       # Script cron jobs
│   └── build.sh                # Script untuk build image
├── runcontainer/
│   └── run-nextcloud.sh        # Script untuk menjalankan container
├── data/                        # Folder untuk data persistent
│   ├── nextcloud-data/         # Data files
│   ├── nextcloud-config/       # Konfigurasi
│   ├── nextcloud-apps/         # Apps tambahan
│   └── mysql/                  # Database MySQL
├── docker-compose.yml          # Docker Compose dengan MySQL
└── README.md
```

## 🔧 Cara Penggunaan

### Metode 1: Build Manual + Run Script

```bash
# Build image
cd platform
chmod +x build.sh
./build.sh

# Run container
cd ../runcontainer
chmod +x run-nextcloud.sh
./run-nextcloud.sh
```

### Metode 2: Docker Compose (Recommended)

```bash
# Build dan jalankan dengan MySQL
docker-compose up -d --build

# Lihat logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🌐 Akses

| Service | URL | Keterangan |
|---------|-----|------------|
| **Nextcloud** | http://localhost:8888 | Main application |
| **phpMyAdmin** | http://localhost:8889 | Database management |

## 📋 Setup Wizard

Saat pertama kali akses Nextcloud:

1. **Buat Admin Account**
   - Username: admin (atau sesuai keinginan)
   - Password: (pilih password yang aman)

2. **Pilih Database**
   - **SQLite**: Untuk testing/personal use
   - **MySQL**: Untuk production (jika menggunakan docker-compose)
     - Host: `mysql`
     - Database: `nextcloud`
     - User: `nextcloud`
     - Password: `nextcloud_password`

3. **Klik Install**

## 🛠️ Fitur Custom Build

### PHP Extensions yang terinstall:
- Core: ctype, curl, dom, fileinfo, gd, iconv, intl, json, mbstring
- Database: pdo, pdo_mysql, pdo_sqlite
- Security: openssl, sodium
- Performance: opcache, apcu
- Media: exif, imagick (imagemagick)
- Additional: zip, xml, xmlreader, xmlwriter, ftp, ldap, gmp, bcmath

### Nginx Features:
- Optimized untuk Nextcloud
- Security headers
- Large file upload support (512MB)
- Gzip compression
- Pretty URLs
- CalDAV/CardDAV support

### Tools Included:
- ffmpeg (untuk video preview)
- imagemagick (untuk image processing)
- curl, wget, unzip, tar

## 📊 Environment Variables

| Variable | Default | Keterangan |
|----------|---------|------------|
| `NEXTCLOUD_VERSION` | 29.0.0 | Versi Nextcloud |
| `PHP_MEMORY_LIMIT` | 512M | PHP memory limit |
| `PHP_UPLOAD_LIMIT` | 512M | Max upload size |
| `PHP_MAX_EXECUTION_TIME` | 300 | Max execution time |

## 🔐 Database Credentials (Docker Compose)

```
MySQL Root Password: root_password
MySQL Database: nextcloud
MySQL User: nextcloud
MySQL Password: nextcloud_password
```

⚠️ **Peringatan**: Ubah password ini untuk production!

## 📝 Commands

```bash
# Build image
docker build -t custom-nextcloud:1.0 ./platform

# View running containers
docker ps

# View logs
docker logs -f custom-nextcloud

# Enter container shell
docker exec -it custom-nextcloud sh

# Run occ command
docker exec -it custom-nextcloud su -s /bin/sh nginx -c "php /var/www/html/occ status"

# Maintenance mode ON
docker exec -it custom-nextcloud su -s /bin/sh nginx -c "php /var/www/html/occ maintenance:mode --on"

# Maintenance mode OFF
docker exec -it custom-nextcloud su -s /bin/sh nginx -c "php /var/www/html/occ maintenance:mode --off"

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🔄 Upgrade Nextcloud

Untuk upgrade versi Nextcloud:

1. Ubah `NEXTCLOUD_VERSION` di Dockerfile
2. Rebuild image: `./build.sh`
3. Restart container

## ⚠️ Catatan Penting

1. **Backup Regular**: Selalu backup folder `data/` secara berkala
2. **SSL/HTTPS**: Untuk production, gunakan reverse proxy dengan SSL
3. **Memory**: Minimal 512MB RAM untuk Nextcloud
4. **Disk Space**: Sesuaikan dengan kebutuhan penyimpanan file

## 🆚 Perbandingan dengan Case Lainnya

| Case | Aplikasi | Base Image | Custom Build |
|------|----------|------------|--------------|
| Case 1 | Apache + PHP | Alpine 3.9 | ✅ Yes |
| Case 2 | VNC Desktop | Alpine 3.18 | ✅ Yes |
| Case 3 | Nginx Static | Nginx Alpine | Minimal |
| Case 4 | Nginx + PHP-FPM | Nginx Alpine | ✅ Yes |
| **Case 5** | **Nextcloud** | **Alpine 3.18** | **✅ Full Custom** |
