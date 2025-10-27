# Unity Portal System - Database Setup Guide

## Overview
This guide provides instructions for setting up the MySQL database for the Unity Portal System, a comprehensive student portal management system.

## Prerequisites
- MySQL 8.0 or higher
- MySQL Workbench or command-line MySQL client
- Node.js and npm (for the application)

## Database Setup

### 1. Create Database
```sql
-- Run the database_schema.sql file
mysql -u root -p < database_schema.sql
```

### 2. Verify Installation
```sql
-- Connect to the database
mysql -u root -p
USE unity_portal_db;

-- Check if tables were created
SHOW TABLES;

-- Verify initial data
SELECT * FROM users WHERE role = 'admin';
SELECT * FROM faculties;
SELECT * FROM programs;
```

## Database Structure

### Core Tables
- **users**: Main user authentication and basic information
- **students**: Extended student information and academic records
- **faculties**: University departments/faculties
- **programs**: Academic programs offered by faculties
- **courses**: Individual courses within programs

### Academic Management
- **student_courses**: Course enrollments
- **assignments**: Course assignments and projects
- **assignment_submissions**: Student submissions
- **grades**: Academic grades and evaluations
- **attendance**: Class attendance records
- **exams**: Examination schedules and results

### Financial Management
- **fee_structure**: Fee definitions by program
- **payments**: Student payment records

### Communication
- **announcements**: University announcements
- **notifications**: User notifications
- **chatbot_qa**: Chatbot question-answer pairs

### System Management
- **system_settings**: Application configuration
- **audit_logs**: System activity logs
- **file_uploads**: File management

## Default Credentials

### Admin User
- **Email**: admin@unity.edu
- **Password**: password (change this in production!)
- **Role**: admin

## Production Considerations

### 1. Security
- Change default admin password
- Create dedicated database user with limited permissions
- Enable SSL connections
- Regular security updates

### 2. Performance
- Monitor query performance
- Add indexes as needed based on usage patterns
- Regular database maintenance

### 3. Backup
- Set up automated daily backups
- Test backup restoration procedures
- Store backups securely

### 4. Environment Variables
Create a `.env` file in your backend directory:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=unity_portal_db
DB_USER=unity_portal_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
```

## API Endpoints Structure

The database schema supports the following API endpoints:

### Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/logout`

### Student Endpoints
- GET `/api/student/dashboard`
- GET `/api/student/courses`
- GET `/api/student/grades`
- GET `/api/student/attendance`
- GET `/api/student/timetable`
- GET `/api/student/fees`
- PUT `/api/student/profile`

### Lecturer Endpoints
- GET `/api/lecturer/dashboard`
- GET `/api/lecturer/courses`
- GET `/api/lecturer/students`
- POST `/api/lecturer/grades`
- POST `/api/lecturer/attendance`

### Admin Endpoints
- GET `/api/admin/dashboard`
- GET `/api/admin/users`
- POST `/api/admin/users`
- PUT `/api/admin/users/:id`
- DELETE `/api/admin/users/:id`
- GET `/api/admin/reports`

### General Endpoints
- GET `/api/announcements`
- POST `/api/announcements`
- GET `/api/notifications/:userId`
- GET `/api/chatbot-qa`

## Maintenance Tasks

### Daily
- Monitor system performance
- Check error logs
- Verify backup completion

### Weekly
- Review user activity logs
- Update system settings if needed
- Check disk space usage

### Monthly
- Analyze usage patterns
- Update chatbot Q&A
- Review and clean old logs
- Performance optimization

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check MySQL service status
   - Verify port 3306 is open
   - Check firewall settings

2. **Authentication Failed**
   - Verify username/password
   - Check user permissions
   - Ensure database exists

3. **Performance Issues**
   - Check slow query log
   - Analyze query execution plans
   - Consider adding indexes

### Log Files
- MySQL error log: `/var/log/mysql/error.log`
- Application logs: Check your backend application logs

## Support

For technical support or questions about the database schema:
1. Check the audit_logs table for system activity
2. Review the system_settings table for configuration
3. Contact your system administrator

## Version History
- v1.0.0: Initial schema creation with comprehensive tables
- Includes user management, academic records, financial management, and communication features
