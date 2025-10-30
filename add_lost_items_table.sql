-- Add Lost Items Table to Unity Portal Database
-- Run this script to add the lost items functionality to your existing database

-- =============================================
-- LOST ITEMS MANAGEMENT TABLES
-- =============================================

-- Lost items
CREATE TABLE IF NOT EXISTS lost_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('electronics', 'clothing', 'books', 'accessories', 'documents', 'other') NOT NULL,
    location VARCHAR(255) NOT NULL,
    date_lost DATE NOT NULL,
    contact_info VARCHAR(255),
    image_path VARCHAR(500),
    status ENUM('lost', 'found', 'claimed') DEFAULT 'lost',
    reported_by INT NOT NULL,
    claimed_by INT NULL,
    claimer_name VARCHAR(255),
    claimer_contact VARCHAR(255),
    claim_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (claimed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_location (location),
    INDEX idx_reported_by (reported_by),
    INDEX idx_created_at (created_at)
);

-- Insert some sample data for testing
INSERT INTO lost_items (item_name, description, category, location, date_lost, contact_info, status, reported_by) VALUES
('iPhone 13', 'Black iPhone 13 with cracked screen', 'electronics', 'Library Building - Floor 2', '2024-01-15', 'student@unity.edu', 'lost', 1),
('Blue Backpack', 'Navy blue backpack with laptop compartment', 'accessories', 'Cafeteria', '2024-01-14', 'student@unity.edu', 'found', 1),
('Calculus Textbook', 'Stewart Calculus 8th Edition', 'books', 'Math Department', '2024-01-13', 'student@unity.edu', 'lost', 1),
('Wireless Headphones', 'Sony WH-1000XM4 headphones', 'electronics', 'Computer Lab', '2024-01-12', 'student@unity.edu', 'found', 1),
('Student ID Card', 'ID card with photo', 'documents', 'Student Center', '2024-01-11', 'student@unity.edu', 'claimed', 1);

-- Create uploads directory for lost item images
-- Note: This will be handled by the backend when the first image is uploaded

SELECT 'Lost Items table created successfully!' as Status;
