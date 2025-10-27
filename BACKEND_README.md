# Unity University Portal - Backend Database Integration

## 📋 Table of Contents
- [Overview](#overview)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Environment Configuration](#environment-configuration)
- [Installation & Setup](#installation--setup)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This document provides comprehensive instructions for setting up and connecting the Unity University Portal frontend to a backend database. The system supports multiple user roles (Student, Lecturer, Admin) with role-based access control.

## 🗄️ Database Setup

### Supported Databases
- **PostgreSQL** (Recommended)
- **MySQL/MariaDB**
- **SQLite** (Development only)

### PostgreSQL Setup (Recommended)

#### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### 2. Create Database and User
```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Create database
CREATE DATABASE unity_university_portal;

-- Create user
CREATE USER unity_admin WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE unity_university_portal TO unity_admin;

-- Connect to the database
\c unity_university_portal;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO unity_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO unity_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO unity_admin;

-- Exit
\q
```

## 🏗️ Database Schema

### Core Tables

#### 1. Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'lecturer', 'admin')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    profile_picture VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Students Table
```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL,
    gpa DECIMAL(3,2),
    advisor_id INTEGER REFERENCES lecturers(id),
    enrollment_date DATE NOT NULL,
    graduation_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Lecturers Table
```sql
CREATE TABLE lecturers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    qualification VARCHAR(200),
    specialization TEXT,
    experience_years INTEGER,
    office VARCHAR(50),
    office_hours TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Courses Table
```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    lecturer_id INTEGER REFERENCES lecturers(id),
    department VARCHAR(100) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    max_students INTEGER DEFAULT 50,
    current_students INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. Enrollments Table
```sql
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'completed')),
    grade VARCHAR(5),
    attendance_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);
```

#### 6. Assignments Table
```sql
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    max_marks INTEGER NOT NULL,
    assignment_type VARCHAR(50) DEFAULT 'homework',
    materials TEXT[], -- Array of file paths
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. Grades Table
```sql
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2),
    feedback TEXT,
    graded_by INTEGER REFERENCES lecturers(id),
    graded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. Attendance Table
```sql
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    remarks TEXT,
    marked_by INTEGER REFERENCES lecturers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, attendance_date)
);
```

#### 9. Announcements Table
```sql
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    target_roles TEXT[], -- Array of roles this announcement is for (student, lecturer, admin)
    author_id INTEGER REFERENCES users(id),
    expires_at TIMESTAMP,
    is_published BOOLEAN DEFAULT false,
    attachments TEXT[], -- Array of file paths
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 10. Fees Table
```sql
CREATE TABLE fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    fee_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'waived')),
    paid_date DATE,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes for Performance
```sql
-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_lecturers_user_id ON lecturers(user_id);
CREATE INDEX idx_courses_lecturer_id ON courses(lecturer_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_attendance_student_course ON attendance(student_id, course_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_announcements_target_roles ON announcements USING GIN(target_roles);
```

## 🔧 Environment Configuration

Create a `.env` file in your backend root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://unity_admin:your_secure_password@localhost:5432/unity_university_portal
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unity_university_portal
DB_USER=unity_admin
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Redis Configuration (Optional - for sessions)
REDIS_URL=redis://localhost:6379
```

## 🚀 Installation & Setup

### Backend Setup (Node.js/Express)

#### 1. Initialize Backend Project
```bash
mkdir unity-portal-backend
cd unity-portal-backend
npm init -y
```

#### 2. Install Dependencies
```bash
# Core dependencies
npm install express cors helmet morgan dotenv
npm install pg sequelize bcryptjs jsonwebtoken
npm install multer express-rate-limit express-validator
npm install nodemailer

# Development dependencies
npm install -D nodemon @types/node typescript
npm install -D jest supertest
```

#### 3. Project Structure
```
unity-portal-backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── lecturerController.js
│   │   ├── courseController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Lecturer.js
│   │   └── Course.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── lecturers.js
│   │   └── courses.js
│   ├── utils/
│   │   ├── database.js
│   │   └── helpers.js
│   └── app.js
├── uploads/
├── .env
├── .gitignore
└── package.json
```

#### 4. Database Connection (src/utils/database.js)
```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
```

#### 5. Main App File (src/app.js)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/lecturers', require('./routes/lecturers'));
app.use('/api/courses', require('./routes/courses'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🔐 Authentication

### JWT Middleware (src/middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
```

## 📡 API Endpoints

### Authentication Endpoints

#### POST /api/auth/login
```javascript
// Request
{
  "email": "student@unity.edu",
  "password": "password123"
}

// Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "student@unity.edu",
    "role": "student",
    "firstName": "John",
    "lastName": "Student"
  }
}
```

#### POST /api/auth/register
```javascript
// Request
{
  "email": "newstudent@unity.edu",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "student",
  "studentId": "STU2024002"
}
```

### Student Endpoints

#### GET /api/students/profile
```javascript
// Response
{
  "success": true,
  "data": {
    "id": 1,
    "studentId": "STU2024001",
    "firstName": "John",
    "lastName": "Student",
    "email": "john.student@unity.edu",
    "program": "Computer Science",
    "year": "Junior",
    "gpa": 3.75,
    "advisor": "Dr. Sarah Johnson"
  }
}
```

#### PUT /api/students/profile
```javascript
// Request
{
  "firstName": "John",
  "lastName": "Student",
  "phone": "+1 (555) 123-4567",
  "address": "123 University Ave"
}
```

#### GET /api/students/courses
```javascript
// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "courseCode": "CS-201",
      "courseName": "Data Structures",
      "credits": 3,
      "lecturer": "Dr. Sarah Johnson",
      "grade": "A-",
      "attendance": 90
    }
  ]
}
```

### Lecturer Endpoints

#### GET /api/lecturers/students
```javascript
// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": "STU2024001",
      "name": "John Student",
      "email": "john.student@unity.edu",
      "attendance": 90,
      "assignmentsCompleted": 8,
      "averageGrade": 85
    }
  ]
}
```

#### POST /api/lecturers/attendance
```javascript
// Request
{
  "courseId": 1,
  "attendanceDate": "2024-03-15",
  "records": [
    {
      "studentId": 1,
      "status": "present"
    },
    {
      "studentId": 2,
      "status": "absent",
      "remarks": "Sick leave"
    }
  ]
}
```

## 🧪 Testing

### Install Testing Dependencies
```bash
npm install -D jest supertest
```

### Test Database Setup
```javascript
// tests/setup.js
const { Sequelize } = require('sequelize');

const testDb = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

module.exports = testDb;
```

### Sample Test
```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Authentication', () => {
  test('POST /api/auth/login should return token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@unity.edu',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });
});
```

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_production_jwt_secret
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Setup
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/unity_portal
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=unity_portal
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 🔧 Frontend Integration

### API Service Setup
```javascript
// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Student methods
  async getStudentProfile() {
    return this.request('/students/profile');
  }

  async updateStudentProfile(data) {
    return this.request('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getStudentCourses() {
    return this.request('/students/courses');
  }
}

export default new ApiService();
```

### Environment Variables for Frontend
```env
# .env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Unity University Portal
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check if database exists
psql -U unity_admin -d unity_university_portal -c "\l"

# Test connection
psql -U unity_admin -d unity_university_portal -c "SELECT version();"
```

#### 2. CORS Issues
```javascript
// Ensure CORS is properly configured
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### 3. JWT Token Issues
```javascript
// Check token expiration
const token = localStorage.getItem('token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const isExpired = payload.exp < Date.now() / 1000;
  if (isExpired) {
    localStorage.removeItem('token');
    // Redirect to login
  }
}
```

#### 4. File Upload Issues
```javascript
// Ensure upload directory exists
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT.io](https://jwt.io/)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)

## 🤝 Support

For additional support or questions:
- Create an issue in the project repository
- Check the troubleshooting section above
- Review the API documentation

---

**Note**: Remember to change all default passwords and secrets before deploying to production!
