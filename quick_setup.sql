-- Quick Database Setup Script
-- Run this in MySQL to set up the database

-- 1. Create database
CREATE DATABASE IF NOT EXISTS unity_portal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE unity_portal_db;

-- 2. Create a simple users table for testing
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    role ENUM('student', 'lecturer', 'admin') NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Create a simple students table
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    studentId VARCHAR(50) UNIQUE NOT NULL,
    programId INT DEFAULT 1,
    enrollmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create a simple lecturers table
CREATE TABLE IF NOT EXISTS lecturers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    lecturerId VARCHAR(50) UNIQUE NOT NULL,
    departmentId INT DEFAULT 1,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Create a simple admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    departmentId INT DEFAULT 1,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Insert test admin user
INSERT INTO users (email, password, firstName, lastName, role, isActive) 
VALUES ('admin@unity.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8KzKzKzK', 'Admin', 'User', 'admin', true)
ON DUPLICATE KEY UPDATE email=email;

-- 7. Insert admin record
INSERT INTO admins (userId, departmentId) 
SELECT id, 1 FROM users WHERE email = 'admin@unity.edu' AND role = 'admin'
ON DUPLICATE KEY UPDATE userId=userId;

-- 8. Insert test student
INSERT INTO users (email, password, firstName, lastName, role, isActive) 
VALUES ('student@unity.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8KzKzKzK', 'John', 'Student', 'student', true)
ON DUPLICATE KEY UPDATE email=email;

-- 9. Insert student record
INSERT INTO students (userId, studentId, programId) 
SELECT id, 'STU001', 1 FROM users WHERE email = 'student@unity.edu' AND role = 'student'
ON DUPLICATE KEY UPDATE userId=userId;

-- 10. Insert test lecturer
INSERT INTO users (email, password, firstName, lastName, role, isActive) 
VALUES ('lecturer@unity.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8KzKzKzK', 'Dr. Smith', 'Lecturer', 'lecturer', true)
ON DUPLICATE KEY UPDATE email=email;

-- 11. Insert lecturer record
INSERT INTO lecturers (userId, lecturerId, departmentId) 
SELECT id, 'LEC001', 1 FROM users WHERE email = 'lecturer@unity.edu' AND role = 'lecturer'
ON DUPLICATE KEY UPDATE userId=userId;

-- Show created tables
SHOW TABLES;

-- Show users
SELECT id, email, firstName, lastName, role, isActive FROM users;
