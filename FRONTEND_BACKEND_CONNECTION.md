# Unity Portal Frontend-Backend Connection Setup

## Quick Start Guide

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp env.example .env
   ```

4. **Edit .env file with your database credentials:**
   ```env
   NODE_ENV=development
   PORT=5000
   
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=unity_portal
   
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-long-and-random
   
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ..  # Go back to root directory
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

### 3. Database Setup

1. **Create MySQL database:**
   ```sql
   CREATE DATABASE unity_portal;
   ```

2. **Import the database schema:**
   ```bash
   mysql -u root -p unity_portal < database_schema.sql
   ```

3. **Create initial admin user:**
   ```sql
   INSERT INTO users (email, password, firstName, lastName, role, isActive, createdAt) 
   VALUES ('admin@unity.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8KzKzKzK', 'Admin', 'User', 'admin', true, NOW());
   ```

### 4. Test the Connection

1. **Backend should be running on:** http://localhost:5000
2. **Frontend should be running on:** http://localhost:3000
3. **Test API health:** http://localhost:5000/api/health

### 5. Default Login Credentials

- **Admin:** admin@unity.edu / password123
- **Student:** student@unity.edu / password123
- **Lecturer:** lecturer@unity.edu / password123

### 6. Troubleshooting

**Backend not starting:**
- Check if port 5000 is available
- Verify database connection in .env
- Check MySQL service is running

**Frontend not connecting:**
- Verify VITE_API_URL in .env.local
- Check if backend is running
- Check browser console for errors

**Database connection issues:**
- Verify MySQL credentials
- Check if database exists
- Import schema if missing

### 7. Production Deployment

1. **Backend:**
   - Set NODE_ENV=production
   - Use PM2 for process management
   - Configure reverse proxy (Nginx)

2. **Frontend:**
   - Build for production: `npm run build`
   - Serve static files
   - Configure HTTPS

### 8. API Endpoints

The frontend now connects to these backend endpoints:

- **Authentication:** `/api/auth/*`
- **Users:** `/api/users/*`
- **Students:** `/api/students/*`
- **Lecturers:** `/api/lecturers/*`
- **Courses:** `/api/courses/*`
- **Assignments:** `/api/assignments/*`
- **Grades:** `/api/grades/*`
- **Attendance:** `/api/attendance/*`
- **Exams:** `/api/exams/*`
- **Fees:** `/api/fees/*`
- **Announcements:** `/api/announcements/*`
- **Notifications:** `/api/notifications/*`
- **Chatbot:** `/api/chatbot/*`
- **Academics:** `/api/academics/*`
- **Reports:** `/api/reports/*`
- **Communication:** `/api/communication/*`
- **Settings:** `/api/settings/*`

### 9. Features Now Available

✅ **Real Authentication** - JWT-based login/logout
✅ **User Management** - Create, update, delete users
✅ **Student Portal** - Dashboard, courses, assignments, grades
✅ **Lecturer Portal** - Course management, grading, attendance
✅ **Admin Portal** - System management, reports, settings
✅ **Real-time Data** - All data comes from MySQL database
✅ **File Uploads** - Assignment submissions, profile pictures
✅ **Notifications** - Real notification system
✅ **Chatbot** - AI-powered Q&A system
✅ **Reports** - Comprehensive reporting system
✅ **Communication** - Messaging between users

### 10. Next Steps

1. **Customize the UI** - Modify components to match your brand
2. **Add more features** - Extend functionality as needed
3. **Configure email** - Set up email notifications
4. **Add file storage** - Configure cloud storage for uploads
5. **Set up monitoring** - Add logging and monitoring
6. **Security audit** - Review and enhance security measures

Your Unity Portal System is now fully connected and ready to use! 🚀
