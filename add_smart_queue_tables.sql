-- Smart Queue System Tables

-- 1) queues
CREATE TABLE IF NOT EXISTS queues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_by INT NOT NULL,
    location VARCHAR(150),
    description TEXT,
    avg_processing_time INT NOT NULL, -- minutes per client
    is_active BOOLEAN DEFAULT TRUE,
    qr_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_created_by (created_by),
    INDEX idx_active (is_active)
);

-- 2) queue_members
CREATE TABLE IF NOT EXISTS queue_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    queue_id INT NOT NULL,
    user_id INT NOT NULL,
    queue_number INT NOT NULL,
    status ENUM('waiting','in_process','served','missed') DEFAULT 'waiting',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    served_at TIMESTAMP NULL,
    FOREIGN KEY (queue_id) REFERENCES queues(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_queue_number (queue_id, queue_number),
    INDEX idx_queue (queue_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

SELECT 'Smart Queue tables ensured' as Status;

