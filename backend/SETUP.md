# Unity Portal Backend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE unity_portal;
   ```

2. **Import Database Schema**
   ```bash
   mysql -u root -p unity_portal < database_schema.sql
   ```

3. **Create Database User (Optional)**
   ```sql
   CREATE USER 'unity_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON unity_portal.* TO 'unity_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 3. Environment Configuration

1. **Copy Environment File**
   ```bash
   cp env.example .env
   ```

2. **Edit .env File**
   ```env
   NODE_ENV=development
   PORT=5000
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=unity_portal
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-long-and-random
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   
   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

### 4. Create Upload Directory

```bash
mkdir uploads
```

### 5. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Initial Data Setup

### 1. Create Admin User

```sql
INSERT INTO users (email, password, firstName, lastName, role, isActive, createdAt) 
VALUES ('admin@unity.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8KzKzKzK', 'Admin', 'User', 'admin', true, NOW());

INSERT INTO admins (userId, departmentId) 
VALUES (1, 1);
```

### 2. Create Sample Faculty

```sql
INSERT INTO faculties (name, description, dean, contactEmail, contactPhone, location, createdAt) 
VALUES ('Computer Science', 'Faculty of Computer Science and Information Technology', 'Dr. John Smith', 'dean@cs.unity.edu', '+1234567890', 'Building A', NOW());
```

### 3. Create Sample Program

```sql
INSERT INTO programs (name, description, facultyId, duration, degreeType, createdAt) 
VALUES ('Bachelor of Computer Science', '4-year undergraduate program in Computer Science', 1, 4, 'Bachelor', NOW());
```

### 4. Create Sample Course

```sql
INSERT INTO courses (name, code, description, credits, semester, year, programId, createdAt) 
VALUES ('Introduction to Programming', 'CS101', 'Basic programming concepts and techniques', 3, '1', 2024, 1, NOW());
```

## API Testing

### 1. Test Health Endpoint

```bash
curl http://localhost:5000/api/health
```

### 2. Test Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@unity.edu",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "studentId": "STU001"
  }'
```

### 3. Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@unity.edu",
    "password": "password123"
  }'
```

## Common Issues

### 1. Database Connection Error

**Error**: `Database connection failed`

**Solution**: 
- Check MySQL service is running
- Verify database credentials in `.env`
- Ensure database exists

### 2. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
- Change PORT in `.env` file
- Kill existing process: `lsof -ti:5000 | xargs kill -9`

### 3. JWT Secret Error

**Error**: `JWT_SECRET is required`

**Solution**:
- Set JWT_SECRET in `.env` file
- Use a long, random string

### 4. File Upload Error

**Error**: `Invalid file type`

**Solution**:
- Check file type is allowed
- Verify file size limits
- Ensure uploads directory exists

## Production Deployment

### 1. Environment Variables

Set production environment variables:
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
JWT_SECRET=your-production-jwt-secret
```

### 2. Process Management

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "unity-portal-backend"
pm2 startup
pm2 save
```

### 3. Reverse Proxy

Configure Nginx as reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL Certificate

Use Let's Encrypt for SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring

### 1. Log Monitoring

```bash
pm2 logs unity-portal-backend
```

### 2. Health Checks

```bash
curl http://localhost:5000/api/health
```

### 3. Database Monitoring

```sql
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Connections';
```

## Backup

### 1. Database Backup

```bash
mysqldump -u root -p unity_portal > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. File Backup

```bash
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz uploads/
```

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable SSL/TLS
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Use parameterized queries
- [ ] Regular backups

## Troubleshooting

### 1. Check Logs

```bash
pm2 logs unity-portal-backend --lines 100
```

### 2. Restart Service

```bash
pm2 restart unity-portal-backend
```

### 3. Check Database Connection

```bash
mysql -u root -p -e "SELECT 1"
```

### 4. Check Port Availability

```bash
netstat -tulpn | grep :5000
```

## Support

For issues and support:
1. Check the logs
2. Verify configuration
3. Test database connection
4. Check network connectivity
5. Review error messages
6. Contact system administrator
