# Unity Portal Backend

A complete Node.js/Express backend API for the Unity Portal System.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete CRUD operations for students, lecturers, and admins
- **Academic Management**: Courses, programs, faculties, and academic records
- **Assignment System**: Assignment creation, submission, and grading
- **Grade Management**: Comprehensive grading system with transcripts
- **Attendance Tracking**: Student attendance monitoring and reporting
- **Exam Management**: Exam scheduling and management
- **Fee Management**: Fee tracking, payments, and financial reporting
- **Communication**: Messaging system between users
- **Notifications**: Real-time notification system
- **Announcements**: System-wide announcements
- **Chatbot**: AI-powered Q&A system
- **Reports**: Comprehensive reporting system
- **Settings**: System configuration management

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Validation**: Express Validator
- **Logging**: Morgan
- **Compression**: Gzip compression

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unity-portal-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
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
   ```

4. **Database Setup**
   - Create MySQL database named `unity_portal`
   - Import the database schema from `database_schema.sql`
   - Run initial data population scripts

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/stats/overview` - Get user statistics

### Students
- `GET /api/students/dashboard/:id` - Student dashboard
- `GET /api/students/courses/:id` - Student courses
- `GET /api/students/assignments/:id` - Student assignments
- `POST /api/students/assignments/submit` - Submit assignment
- `GET /api/students/grades/:id` - Student grades
- `GET /api/students/attendance/:id` - Student attendance
- `GET /api/students/fees/:id` - Student fees
- `GET /api/students/profile/:id` - Student profile
- `PUT /api/students/profile/:id` - Update student profile

### Lecturers
- `GET /api/lecturers/dashboard/:id` - Lecturer dashboard
- `GET /api/lecturers/courses/:id` - Lecturer courses
- `GET /api/lecturers/students/:id` - Students in lecturer's courses
- `GET /api/lecturers/assignments/:id` - Lecturer's assignments
- `POST /api/lecturers/assignments` - Create assignment
- `POST /api/lecturers/assignments/grade` - Grade assignment
- `GET /api/lecturers/submissions/:id` - Get submissions for grading
- `POST /api/lecturers/attendance` - Mark attendance
- `GET /api/lecturers/profile/:id` - Lecturer profile
- `PUT /api/lecturers/profile/:id` - Update lecturer profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll student in course
- `DELETE /api/courses/:id/enroll/:studentId` - Unenroll student
- `GET /api/courses/stats/overview` - Course statistics

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `POST /api/assignments/:id/submit` - Submit assignment
- `POST /api/assignments/:id/grade` - Grade assignment
- `GET /api/assignments/stats/overview` - Assignment statistics

### Grades
- `GET /api/grades` - Get all grades
- `GET /api/grades/:id` - Get grade by ID
- `POST /api/grades` - Create grade
- `PUT /api/grades/:id` - Update grade
- `DELETE /api/grades/:id` - Delete grade
- `GET /api/grades/transcript/:studentId` - Student transcript
- `GET /api/grades/stats/overview` - Grade statistics
- `POST /api/grades/bulk-import` - Bulk import grades

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:id` - Get attendance by ID
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance
- `GET /api/attendance/summary/student/:studentId` - Student attendance summary
- `GET /api/attendance/summary/course/:courseId` - Course attendance summary
- `GET /api/attendance/stats/overview` - Attendance statistics

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create exam
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam
- `GET /api/exams/student/:studentId/upcoming` - Upcoming exams for student
- `GET /api/exams/schedule/:courseId` - Exam schedule for course
- `GET /api/exams/stats/overview` - Exam statistics

### Fees
- `GET /api/fees` - Get all fees
- `GET /api/fees/:id` - Get fee by ID
- `POST /api/fees` - Create fee
- `PUT /api/fees/:id` - Update fee
- `DELETE /api/fees/:id` - Delete fee
- `POST /api/fees/:id/payment` - Record payment
- `GET /api/fees/:id/payments` - Get payment history
- `GET /api/fees/student/:studentId/summary` - Student fee summary
- `GET /api/fees/stats/overview` - Fee statistics

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement
- `GET /api/announcements/user/:userId/role/:role` - Get announcements for user role
- `GET /api/announcements/stats/overview` - Announcement statistics

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/:id` - Get notification by ID
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id` - Update notification
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/user/:userId/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/user/:userId` - Get user notifications
- `GET /api/notifications/user/:userId/count` - Get notification count
- `GET /api/notifications/stats/overview` - Notification statistics

### Chatbot
- `GET /api/chatbot` - Get all Q&A
- `GET /api/chatbot/:id` - Get Q&A by ID
- `POST /api/chatbot` - Create Q&A
- `PUT /api/chatbot/:id` - Update Q&A
- `DELETE /api/chatbot/:id` - Delete Q&A
- `POST /api/chatbot/search` - Search Q&A
- `GET /api/chatbot/category/:category` - Get Q&A by category
- `GET /api/chatbot/stats/overview` - Chatbot statistics
- `POST /api/chatbot/bulk-import` - Bulk import Q&A

### Academics
- `GET /api/academics/faculties` - Get all faculties
- `GET /api/academics/faculties/:id` - Get faculty by ID
- `POST /api/academics/faculties` - Create faculty
- `PUT /api/academics/faculties/:id` - Update faculty
- `DELETE /api/academics/faculties/:id` - Delete faculty
- `GET /api/academics/programs` - Get all programs
- `GET /api/academics/programs/:id` - Get program by ID
- `POST /api/academics/programs` - Create program
- `PUT /api/academics/programs/:id` - Update program
- `DELETE /api/academics/programs/:id` - Delete program
- `GET /api/academics/stats/overview` - Academic statistics

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports/students` - Generate student report
- `POST /api/reports/academic` - Generate academic report
- `POST /api/reports/financial` - Generate financial report
- `DELETE /api/reports/:id` - Delete report

### Communication
- `GET /api/communication` - Get all communications
- `GET /api/communication/:id` - Get communication by ID
- `POST /api/communication/send` - Send message
- `POST /api/communication/send-bulk` - Send bulk message
- `PUT /api/communication/:id/status` - Update communication status
- `PUT /api/communication/:id/read` - Mark as read
- `DELETE /api/communication/:id` - Delete communication
- `GET /api/communication/inbox/:userId` - Get user inbox
- `GET /api/communication/sent/:userId` - Get sent messages
- `GET /api/communication/count/:userId` - Get communication count
- `GET /api/communication/stats/overview` - Communication statistics

### Settings
- `GET /api/settings` - Get all settings
- `GET /api/settings/category/:category` - Get settings by category
- `PUT /api/settings` - Update settings
- `PUT /api/settings/:category/:key` - Update single setting
- `POST /api/settings` - Create new setting
- `DELETE /api/settings/:category/:key` - Delete setting
- `POST /api/settings/reset` - Reset settings to default
- `GET /api/settings/export` - Export settings
- `POST /api/settings/import` - Import settings
- `GET /api/settings/system/info` - Get system information

## Database Schema

The backend uses a comprehensive MySQL database schema with the following main tables:

- **users** - User accounts and authentication
- **students** - Student-specific information
- **lecturers** - Lecturer-specific information
- **admins** - Admin-specific information
- **faculties** - Faculty/department information
- **programs** - Academic programs
- **courses** - Course information
- **enrollments** - Student course enrollments
- **assignments** - Assignment information
- **submissions** - Assignment submissions
- **grades** - Grade records
- **attendance** - Attendance records
- **exams** - Exam information
- **fees** - Fee information
- **payments** - Payment records
- **announcements** - System announcements
- **notifications** - User notifications
- **chatbot_qa** - Chatbot Q&A data
- **communications** - Communication records
- **settings** - System settings
- **reports** - Generated reports

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for students, lecturers, and admins
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Request validation using express-validator
- **SQL Injection Protection**: Parameterized queries
- **Password Hashing**: bcrypt for password security

## Error Handling

- Comprehensive error handling middleware
- Structured error responses
- Logging for debugging
- Graceful shutdown handling

## File Upload

- Multer for file upload handling
- File type validation
- Size limits
- Secure file storage

## Development

- **Hot Reload**: Nodemon for development
- **Environment Variables**: Configuration management
- **Logging**: Morgan for HTTP request logging
- **Compression**: Gzip compression for responses

## Production Considerations

- Environment-specific configurations
- Database connection pooling
- Error logging and monitoring
- Performance optimization
- Security hardening
- Backup strategies

## API Documentation

The API follows RESTful conventions with:
- JSON request/response format
- HTTP status codes
- Consistent error handling
- Pagination support
- Filtering and searching
- Sorting options

## Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License
