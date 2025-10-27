const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, type, status, read } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT n.*, u.firstName, u.lastName, u.email
      FROM notifications n
      LEFT JOIN users u ON n.senderId = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (userId) {
      query += ' AND n.userId = ?';
      queryParams.push(userId);
    }

    if (type) {
      query += ' AND n.type = ?';
      queryParams.push(type);
    }

    if (status) {
      query += ' AND n.status = ?';
      queryParams.push(status);
    }

    if (read !== undefined) {
      query += ' AND n.isRead = ?';
      queryParams.push(read === 'true');
    }

    query += ' ORDER BY n.createdAt DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [notifications] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM notifications n
      WHERE 1=1
    `;
    const countParams = [];

    if (userId) {
      countQuery += ' AND n.userId = ?';
      countParams.push(userId);
    }

    if (type) {
      countQuery += ' AND n.type = ?';
      countParams.push(type);
    }

    if (status) {
      countQuery += ' AND n.status = ?';
      countParams.push(status);
    }

    if (read !== undefined) {
      countQuery += ' AND n.isRead = ?';
      countParams.push(read === 'true');
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get notification by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [notifications] = await pool.execute(`
      SELECT n.*, u.firstName, u.lastName, u.email
      FROM notifications n
      LEFT JOIN users u ON n.senderId = u.id
      WHERE n.id = ?
    `, [id]);

    if (notifications.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notifications[0]);

  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
});

// Create notification
router.post('/', [
  body('userId').isInt(),
  body('title').notEmpty().trim(),
  body('message').notEmpty().trim(),
  body('type').isIn(['info', 'warning', 'error', 'success', 'assignment', 'grade', 'announcement', 'system'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, title, message, type, data, priority, scheduledAt } = req.body;
    const senderId = req.user.userId;

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Insert notification
    const [result] = await pool.execute(
      'INSERT INTO notifications (userId, senderId, title, message, type, data, priority, scheduledAt, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "active", NOW())',
      [userId, senderId, title, message, type, JSON.stringify(data || {}), priority || 'medium', scheduledAt]
    );

    res.status(201).json({
      message: 'Notification created successfully',
      notificationId: result.insertId
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Update notification
router.put('/:id', [
  body('title').optional().notEmpty().trim(),
  body('message').optional().notEmpty().trim(),
  body('type').optional().isIn(['info', 'warning', 'error', 'success', 'assignment', 'grade', 'announcement', 'system']),
  body('status').optional().isIn(['active', 'inactive', 'archived'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, message, type, data, priority, status } = req.body;

    // Check if notification exists
    const [notifications] = await pool.execute(
      'SELECT id FROM notifications WHERE id = ?',
      [id]
    );

    if (notifications.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (message) {
      updateFields.push('message = ?');
      updateValues.push(message);
    }
    if (type) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (data) {
      updateFields.push('data = ?');
      updateValues.push(JSON.stringify(data));
    }
    if (priority) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(id);

    await pool.execute(
      `UPDATE notifications SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Notification updated successfully' });

  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if notification exists
    const [notifications] = await pool.execute(
      'SELECT id FROM notifications WHERE id = ?',
      [id]
    );

    if (notifications.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Mark as read
    await pool.execute(
      'UPDATE notifications SET isRead = true, readAt = NOW(), updatedAt = NOW() WHERE id = ?',
      [id]
    );

    res.json({ message: 'Notification marked as read' });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read for user
router.put('/user/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Mark all as read
    const [result] = await pool.execute(
      'UPDATE notifications SET isRead = true, readAt = NOW(), updatedAt = NOW() WHERE userId = ? AND isRead = false',
      [userId]
    );

    res.json({ 
      message: 'All notifications marked as read',
      updatedCount: result.affectedRows
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if notification exists
    const [notifications] = await pool.execute(
      'SELECT id FROM notifications WHERE id = ?',
      [id]
    );

    if (notifications.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Delete notification
    await pool.execute('DELETE FROM notifications WHERE id = ?', [id]);

    res.json({ message: 'Notification deleted successfully' });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Get user notifications
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, unreadOnly = false } = req.query;

    let query = `
      SELECT n.*, u.firstName, u.lastName, u.email
      FROM notifications n
      LEFT JOIN users u ON n.senderId = u.id
      WHERE n.userId = ? AND n.status = 'active'
    `;

    const queryParams = [userId];

    if (unreadOnly === 'true') {
      query += ' AND n.isRead = false';
    }

    query += ' ORDER BY n.createdAt DESC LIMIT ?';
    queryParams.push(parseInt(limit));

    const [notifications] = await pool.execute(query, queryParams);

    res.json(notifications);

  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch user notifications' });
  }
});

// Get notification count for user
router.get('/user/:userId/count', async (req, res) => {
  try {
    const { userId } = req.params;

    const [counts] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN isRead = false THEN 1 ELSE 0 END) as unread
      FROM notifications 
      WHERE userId = ? AND status = 'active'
    `, [userId]);

    res.json(counts[0] || { total: 0, unread: 0 });

  } catch (error) {
    console.error('Get notification count error:', error);
    res.status(500).json({ error: 'Failed to fetch notification count' });
  }
});

// Get notification statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalNotifications,
        SUM(CASE WHEN isRead = false THEN 1 ELSE 0 END) as unreadNotifications,
        SUM(CASE WHEN isRead = true THEN 1 ELSE 0 END) as readNotifications,
        COUNT(CASE WHEN type = 'info' THEN 1 END) as infoNotifications,
        COUNT(CASE WHEN type = 'warning' THEN 1 END) as warningNotifications,
        COUNT(CASE WHEN type = 'error' THEN 1 END) as errorNotifications,
        COUNT(CASE WHEN type = 'success' THEN 1 END) as successNotifications,
        COUNT(CASE WHEN type = 'assignment' THEN 1 END) as assignmentNotifications,
        COUNT(CASE WHEN type = 'grade' THEN 1 END) as gradeNotifications,
        COUNT(CASE WHEN type = 'announcement' THEN 1 END) as announcementNotifications,
        COUNT(CASE WHEN type = 'system' THEN 1 END) as systemNotifications
      FROM notifications
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ error: 'Failed to fetch notification statistics' });
  }
});

module.exports = router;
