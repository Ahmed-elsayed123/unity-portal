
-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- USER MANAGEMENT TABLES
-- =============================================

-- Users table - Main user authentication and basic info
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('student', 'lecturer', 'admin') NOT NULL,
    status ENUM('active', 'inactive', 'pending', 'suspended') DEFAULT 'active',
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- User sessions for authentication
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires (expires_at)
);

-- =============================================
-- ACADEMIC STRUCTURE TABLES
-- =============================================

-- Faculties/Departments
CREATE TABLE faculties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dean_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dean_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_name (name)
);

-- Academic Programs
CREATE TABLE programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    level ENUM('undergraduate', 'graduate', 'phd') NOT NULL,
    duration_years INT NOT NULL,
    credits_required INT NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
    INDEX idx_faculty (faculty_id),
    INDEX idx_level (level),
    INDEX idx_status (status)
);

-- Courses
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credits INT NOT NULL,
    semester ENUM('fall', 'spring', 'summer') NOT NULL,
    year YEAR NOT NULL,
    lecturer_id INT NOT NULL,
    prerequisites TEXT,
    max_students INT DEFAULT 50,
    status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course (code, semester, year),
    INDEX idx_program (program_id),
    INDEX idx_lecturer (lecturer_id),
    INDEX idx_semester_year (semester, year)
);

-- =============================================
-- STUDENT MANAGEMENT TABLES
-- =============================================

-- Students table - Extended student information
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    program_id INT NOT NULL,
    enrollment_year YEAR NOT NULL,
    current_semester INT DEFAULT 1,
    gpa DECIMAL(3,2) DEFAULT 0.00,
    status ENUM('active', 'graduated', 'suspended', 'withdrawn') DEFAULT 'active',
    graduation_date DATE NULL,
    advisor_id INT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (advisor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_student_id (student_id),
    INDEX idx_program (program_id),
    INDEX idx_status (status),
    INDEX idx_enrollment_year (enrollment_year)
);

-- Student course enrollments
CREATE TABLE student_courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('enrolled', 'dropped', 'completed', 'failed') DEFAULT 'enrolled',
    final_grade VARCHAR(2),
    grade_points DECIMAL(3,2),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id),
    INDEX idx_student (student_id),
    INDEX idx_course (course_id),
    INDEX idx_status (status)
);

-- =============================================
-- ACADEMIC RECORDS TABLES
-- =============================================

-- Assignments
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    max_points INT NOT NULL,
    assignment_type ENUM('homework', 'project', 'quiz', 'exam', 'lab') NOT NULL,
    instructions TEXT,
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_due_date (due_date),
    INDEX idx_type (assignment_type)
);

-- Student assignment submissions
CREATE TABLE assignment_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_text TEXT,
    attachments JSON,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade DECIMAL(5,2),
    feedback TEXT,
    graded_at TIMESTAMP NULL,
    graded_by INT,
    status ENUM('submitted', 'graded', 'late', 'missing') DEFAULT 'submitted',
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_submission (assignment_id, student_id),
    INDEX idx_assignment (assignment_id),
    INDEX idx_student (student_id),
    INDEX idx_status (status)
);

-- Grades
CREATE TABLE grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    assignment_id INT NULL,
    grade_type ENUM('assignment', 'midterm', 'final', 'participation', 'overall') NOT NULL,
    grade_value DECIMAL(5,2) NOT NULL,
    max_points DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    academic_year YEAR NOT NULL,
    comments TEXT,
    graded_by INT NOT NULL,
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_course (course_id),
    INDEX idx_semester_year (semester, academic_year),
    INDEX idx_type (grade_type)
);

-- Attendance
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
    notes TEXT,
    recorded_by INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (student_id, course_id, date),
    INDEX idx_student (student_id),
    INDEX idx_course (course_id),
    INDEX idx_date (date)
);

-- =============================================
-- EXAMINATION TABLES
-- =============================================

-- Exams
CREATE TABLE exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    exam_type ENUM('midterm', 'final', 'quiz', 'makeup') NOT NULL,
    exam_date TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    max_points INT NOT NULL,
    instructions TEXT,
    location VARCHAR(255),
    status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_exam_date (exam_date),
    INDEX idx_type (exam_type)
);

-- Exam results
CREATE TABLE exam_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_id INT NOT NULL,
    student_id INT NOT NULL,
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    percentage DECIMAL(5,2),
    status ENUM('taken', 'absent', 'excused') DEFAULT 'taken',
    graded_at TIMESTAMP NULL,
    graded_by INT,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_exam_result (exam_id, student_id),
    INDEX idx_exam (exam_id),
    INDEX idx_student (student_id)
);

-- =============================================
-- FINANCIAL MANAGEMENT TABLES
-- =============================================

-- Fee structure
CREATE TABLE fee_structure (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    fee_type ENUM('tuition', 'registration', 'library', 'lab', 'sports', 'other') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    academic_year YEAR NOT NULL,
    due_date DATE NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    INDEX idx_program (program_id),
    INDEX idx_semester_year (semester, academic_year),
    INDEX idx_fee_type (fee_type)
);

-- Student payments
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    fee_structure_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'credit_card', 'scholarship', 'loan') NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    receipt_url VARCHAR(500),
    notes TEXT,
    processed_by INT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_structure_id) REFERENCES fee_structure(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_student (student_id),
    INDEX idx_payment_date (payment_date),
    INDEX idx_status (status)
);

-- =============================================
-- COMMUNICATION TABLES
-- =============================================

-- Announcements
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    audience ENUM('all', 'students', 'lecturers', 'staff') DEFAULT 'all',
    target_groups JSON,
    status ENUM('draft', 'scheduled', 'published', 'expired') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    attachments JSON,
    read_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_status (status),
    INDEX idx_published (published_at),
    INDEX idx_expires (expires_at)
);

-- Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
);

-- =============================================
-- TIMETABLE MANAGEMENT TABLES
-- =============================================

-- Class schedules
CREATE TABLE class_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    semester VARCHAR(10) NOT NULL,
    academic_year YEAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_day_time (day_of_week, start_time),
    INDEX idx_semester_year (semester, academic_year)
);

-- =============================================
-- SYSTEM MANAGEMENT TABLES
-- =============================================

-- System settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_key (setting_key)
);

-- Audit logs
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_created (created_at)
);

-- Chatbot Q&A
CREATE TABLE chatbot_qa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    questions JSON NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active)
);

-- =============================================
-- FILE MANAGEMENT TABLES
-- =============================================

-- File uploads
CREATE TABLE file_uploads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type ENUM('document', 'image', 'video', 'audio', 'other') NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_file_type (file_type),
    INDEX idx_uploaded (uploaded_at)
);

-- =============================================
-- INITIAL DATA INSERTION
-- =============================================

-- Insert default admin user
INSERT INTO users (email, password_hash, name, role, status) VALUES 
('admin@unity.edu', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin', 'active');

-- Insert default faculty
INSERT INTO faculties (name, description) VALUES 
('Computer Science', 'Department of Computer Science and Information Technology'),
('Mathematics', 'Department of Mathematics and Statistics'),
('Physics', 'Department of Physics and Astronomy'),
('English', 'Department of English Language and Literature'),
('Business', 'Department of Business Administration');

-- Insert default programs
INSERT INTO programs (faculty_id, name, level, duration_years, credits_required, description) VALUES 
(1, 'Bachelor of Computer Science', 'undergraduate', 4, 120, 'Comprehensive computer science program'),
(1, 'Master of Computer Science', 'graduate', 2, 60, 'Advanced computer science studies'),
(2, 'Bachelor of Mathematics', 'undergraduate', 4, 120, 'Mathematics and statistics program'),
(3, 'Bachelor of Physics', 'undergraduate', 4, 120, 'Physics and astronomy program'),
(4, 'Bachelor of English', 'undergraduate', 4, 120, 'English language and literature program'),
(5, 'Bachelor of Business Administration', 'undergraduate', 4, 120, 'Business administration program');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES 
('university_name', 'Unity University', 'string', 'Name of the university'),
('academic_year', '2024', 'string', 'Current academic year'),
('semester', 'spring', 'string', 'Current semester'),
('max_file_size', '10485760', 'number', 'Maximum file upload size in bytes (10MB)'),
('session_timeout', '3600', 'number', 'Session timeout in seconds (1 hour)'),
('maintenance_mode', 'false', 'boolean', 'System maintenance mode'),
('registration_open', 'true', 'boolean', 'Student registration status');

-- Insert sample chatbot Q&A
INSERT INTO chatbot_qa (questions, answer, category) VALUES 
('["How do I register for courses?", "Course registration", "Registration help"]', 'You can register for courses through the Student Portal. Go to Courses > Register and select your desired courses for the semester.', 'registration'),
('["How do I check my grades?", "View grades", "Grade inquiry"]', 'You can view your grades by going to Grades section in your student dashboard. All your course grades and GPA will be displayed there.', 'grades'),
('["How do I pay my fees?", "Fee payment", "Payment help"]', 'You can pay your fees online through the Fees section. We accept bank transfers, credit cards, and other payment methods.', 'fees'),
('["How do I view my timetable?", "Class schedule", "Schedule help"]', 'Your class timetable is available in the Timetable section. It shows all your scheduled classes with times and locations.', 'schedule');

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Student dashboard view
CREATE VIEW student_dashboard_view AS
SELECT 
    s.id,
    s.student_id,
    u.name,
    u.email,
    p.name as program_name,
    f.name as faculty_name,
    s.current_semester,
    s.gpa,
    s.status,
    s.enrollment_year
FROM students s
JOIN users u ON s.user_id = u.id
JOIN programs p ON s.program_id = p.id
JOIN faculties f ON p.faculty_id = f.id;

-- Course details view
CREATE VIEW course_details_view AS
SELECT 
    c.id,
    c.code,
    c.name,
    c.description,
    c.credits,
    c.semester,
    c.year,
    u.name as lecturer_name,
    p.name as program_name,
    f.name as faculty_name,
    COUNT(sc.student_id) as enrolled_students
FROM courses c
JOIN users u ON c.lecturer_id = u.id
JOIN programs p ON c.program_id = p.id
JOIN faculties f ON p.faculty_id = f.id
LEFT JOIN student_courses sc ON c.id = sc.course_id AND sc.status = 'enrolled'
GROUP BY c.id;

-- =============================================
-- STORED PROCEDURES
-- =============================================

DELIMITER //

-- Procedure to calculate student GPA
CREATE PROCEDURE CalculateStudentGPA(IN student_id INT)
BEGIN
    DECLARE total_points DECIMAL(10,2) DEFAULT 0;
    DECLARE total_credits INT DEFAULT 0;
    DECLARE calculated_gpa DECIMAL(3,2);
    
    SELECT 
        SUM(g.grade_value * c.credits),
        SUM(c.credits)
    INTO total_points, total_credits
    FROM grades g
    JOIN courses c ON g.course_id = c.id
    WHERE g.student_id = student_id 
    AND g.grade_type = 'overall';
    
    IF total_credits > 0 THEN
        SET calculated_gpa = total_points / total_credits;
        UPDATE students SET gpa = calculated_gpa WHERE id = student_id;
    END IF;
END //

-- Procedure to get student attendance percentage
CREATE PROCEDURE GetStudentAttendancePercentage(IN student_id INT, IN course_id INT)
BEGIN
    DECLARE total_classes INT DEFAULT 0;
    DECLARE attended_classes INT DEFAULT 0;
    DECLARE attendance_percentage DECIMAL(5,2);
    
    SELECT COUNT(*) INTO total_classes
    FROM attendance 
    WHERE student_id = student_id AND course_id = course_id;
    
    SELECT COUNT(*) INTO attended_classes
    FROM attendance 
    WHERE student_id = student_id AND course_id = course_id 
    AND status IN ('present', 'late');
    
    IF total_classes > 0 THEN
        SET attendance_percentage = (attended_classes / total_classes) * 100;
        SELECT attendance_percentage as percentage;
    ELSE
        SELECT 0 as percentage;
    END IF;
END //

DELIMITER ;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger to update student GPA when grades are inserted/updated
DELIMITER //
CREATE TRIGGER update_student_gpa_after_grade_insert
AFTER INSERT ON grades
FOR EACH ROW
BEGIN
    CALL CalculateStudentGPA(NEW.student_id);
END //

CREATE TRIGGER update_student_gpa_after_grade_update
AFTER UPDATE ON grades
FOR EACH ROW
BEGIN
    CALL CalculateStudentGPA(NEW.student_id);
END //
DELIMITER ;

-- Trigger to log user actions
DELIMITER //
CREATE TRIGGER log_user_login
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.last_login != NEW.last_login THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
        VALUES (NEW.id, 'LOGIN', 'users', NEW.id, JSON_OBJECT('last_login', NEW.last_login));
    END IF;
END //
DELIMITER ;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Additional indexes for better performance
CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_students_program_status ON students(program_id, status);
CREATE INDEX idx_courses_semester_year_status ON courses(semester, year, status);
CREATE INDEX idx_grades_student_semester ON grades(student_id, semester, academic_year);
CREATE INDEX idx_attendance_student_course_date ON attendance(student_id, course_id, date);
CREATE INDEX idx_payments_student_status ON payments(student_id, status);
CREATE INDEX idx_announcements_status_published ON announcements(status, published_at);

-- =============================================
-- GRANTS AND PERMISSIONS
-- =============================================

-- Create application user (replace with your actual credentials)
-- CREATE USER 'unity_portal_user'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON unity_portal_db.* TO 'unity_portal_user'@'localhost';
-- FLUSH PRIVILEGES;

-- =============================================
-- BACKUP AND MAINTENANCE
-- =============================================

-- Create backup procedure
DELIMITER //
CREATE PROCEDURE CreateDatabaseBackup()
BEGIN
    -- This would typically be handled by mysqldump in production
    -- For now, we'll just log the backup request
    INSERT INTO audit_logs (action, table_name, new_values)
    VALUES ('BACKUP_REQUESTED', 'database', JSON_OBJECT('timestamp', NOW()));
END //
DELIMITER ;

-- =============================================
-- END OF SCHEMA
-- =============================================

-- Display completion message
SELECT 'Unity Portal Database Schema Created Successfully!' as Status;
