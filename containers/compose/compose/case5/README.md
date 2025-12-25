# Case 5 - Task Manager Application

Aplikasi pencatatan task menggunakan stack modern dengan Docker containers.

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite + shadcn/ui (Radix UI) + Tailwind CSS |
| **Backend** | Node.js + Express.js + Prisma ORM |
| **Database** | MySQL 8.0 |
| **Web Server** | Nginx (Reverse Proxy + SSL) |
| **Admin DB** | phpMyAdmin |
| **Container** | Docker + Docker Compose |

## 📁 Struktur Folder

```
case5/
├── backend/                 # Express.js Backend
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── src/
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   ├── routes/
│   │   │   └── taskRoutes.js
│   │   └── index.js        # Main server
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── nginx-conf/
│   └── nginx.conf          # Reverse proxy config
├── certs/
│   ├── MyCert.crt          # SSL Certificate
│   └── MyPrivate.key       # SSL Private Key
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md
```

## 🔧 Konfigurasi

### Environment Variables (.env)

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=taskmanager2024!
MYSQL_DATABASE=taskdb
MYSQL_USER=taskuser
MYSQL_PASSWORD=taskpass2024!

# PHPMyAdmin Configuration
PHPMYADMIN_PORT=8080

# Backend Configuration
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql://taskuser:taskpass2024!@mysql:3306/taskdb

# Frontend Configuration
VITE_API_URL=https://localhost/api

# Nginx Ports
HTTP_PORT=80
HTTPS_PORT=443
```

## 🚀 Cara Menjalankan

### Prerequisites
- Docker & Docker Compose terinstall
- Port 80, 443, 8080 tersedia

### Langkah-langkah

1. **Clone/Navigate ke folder case5**
   ```bash
   cd containers/compose/compose/case5
   ```

2. **Generate SSL Certificate (Opsional - jika belum ada)**
   ```bash
   # Generate self-signed certificate
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout certs/MyPrivate.key \
     -out certs/MyCert.crt \
     -subj "/C=ID/ST=Jawa Timur/L=Surabaya/O=Cloud Computing/CN=localhost"
   ```

3. **Build dan jalankan containers**
   ```bash
   docker-compose up -d --build
   ```

4. **Akses aplikasi**
   - 🌐 **Frontend**: https://localhost (atau http://localhost akan redirect ke HTTPS)
   - 📊 **phpMyAdmin**: http://localhost:8080
   - 🔌 **API Health**: https://localhost/api/health

## 🛠️ API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/tasks` | Mendapatkan semua tasks |
| GET | `/api/tasks/:id` | Mendapatkan task berdasarkan ID |
| POST | `/api/tasks` | Membuat task baru |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Update status task |
| DELETE | `/api/tasks/:id` | Hapus task |
| GET | `/api/tasks/filter/status/:status` | Filter berdasarkan status |
| GET | `/api/tasks/filter/priority/:priority` | Filter berdasarkan priority |
| GET | `/api/health` | Health check |

### Contoh Request

**Membuat Task Baru:**
```bash
curl -X POST https://localhost/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Belajar Docker Compose",
    "description": "Mempelajari cara membuat multi-container application",
    "priority": "HIGH",
    "dueDate": "2024-12-31"
  }' -k
```

**Update Status:**
```bash
curl -X PATCH https://localhost/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS"}' -k
```

## 📊 Database Schema

### Task Model

| Field | Type | Description |
|-------|------|-------------|
| id | INT | Primary key, auto increment |
| title | VARCHAR(255) | Judul task (required) |
| description | TEXT | Deskripsi task (optional) |
| status | ENUM | PENDING, IN_PROGRESS, COMPLETED, CANCELLED |
| priority | ENUM | LOW, MEDIUM, HIGH, URGENT |
| dueDate | DATETIME | Tanggal deadline (optional) |
| createdAt | DATETIME | Waktu pembuatan |
| updatedAt | DATETIME | Waktu update terakhir |

## 🐳 Docker Services

| Service | Image/Build | Port | Description |
|---------|-------------|------|-------------|
| nginx | nginx:alpine | 80, 443 | Reverse proxy + SSL |
| frontend | Custom | 3000 (internal) | React SPA |
| backend | Custom | 5000 (internal) | Express API |
| mysql | mysql:8.0 | 3306 (internal) | Database |
| phpmyadmin | phpmyadmin:5.2.1 | 8080 | Database admin |

## 📝 Commands

```bash
# Build dan start
docker-compose up -d --build

# Stop semua services
docker-compose down

# Lihat logs
docker-compose logs -f

# Lihat logs service tertentu
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart service
docker-compose restart backend

# Rebuild service tertentu
docker-compose up -d --build backend

# Masuk ke container
docker exec -it case5_backend sh
docker exec -it case5_mysql mysql -u root -p

# Hapus semua data (termasuk database)
docker-compose down -v
```

## 🎨 Fitur UI

- ✨ Modern dark theme dengan glassmorphism
- 📊 Dashboard dengan statistik real-time
- 🏷️ Priority dan status badges dengan warna
- 🔍 Filter tasks berdasarkan status
- ✏️ CRUD lengkap dengan modal forms
- 📱 Responsive design
- 🎭 Smooth animations

## 📌 Notes

- Sertifikat SSL adalah self-signed, browser akan menampilkan warning
- Untuk production, gunakan sertifikat dari CA terpercaya (Let's Encrypt)
- Database data disimpan di folder `./dbdata` untuk persistensi
- Jangan lupa backup database sebelum menghapus volumes

## 🔗 Referensi

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
