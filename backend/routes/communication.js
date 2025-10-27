const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all communication records
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, senderId, recipientId } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT c.*, 
             s.firstName as senderFirstName, s.lastName as senderLastName, s.email as senderEmail,
             r.firstName as recipientFirstName, r.lastName as recipientLastName, r.email as recipientEmail
      FROM communications c
      LEFT JOIN users s ON c.senderId = s.id
      LEFT JOIN users r ON c.recipientId = r.id
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (type) {
      query += ' AND c.type = ?';
      queryParams.push(type);
    }

    if (status) {
      query += ' AND c.status = ?';
      queryParams.push(status);
    }

    if (senderId) {
      query += ' AND c.senderId = ?';
      queryParams.push(senderId);
    }

    if (recipientId) {
      query += ' AND c.recipientId = ?';
      queryParams.push(recipientId);
    }

    query += ' ORDER BY c.createdAt DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [communications] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM communications c
      WHERE 1=1
    `;
    const countParams = [];

    if (type) {
      countQuery += ' AND c.type = ?';
      countParams.push(type);
    }

    if (status) {
      countQuery += ' AND c.status = ?';
      countParams.push(status);
    }

    if (senderId) {
      countQuery += ' AND c.senderId = ?';
      countParams.push(senderId);
    }

    if (recipientId) {
      countQuery += ' AND c.recipientId = ?';
      countParams.push(recipientId);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      communications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get communications error:', error);
    res.status(500).json({ error: 'Failed to fetch communications' });
  }
});

// Get communication by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [communications] = await pool.execute(`
      SELECT c.*, 
             s.firstName as senderFirstName, s.lastName as senderLastName, s.email as senderEmail,
             r.firstName as recipientFirstName, r.lastName as recipientLastName, r.email as recipientEmail
      FROM communications c
      LEFT JOIN users s ON c.senderId = s.id
      LEFT JOIN users r ON c.recipientId = r.id
      WHERE c.id = ?
    `, [id]);

    if (communications.length === 0) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    res.json(communications[0]);

  } catch (error) {
    console.error('Get communication error:', error);
    res.status(500).json({ error: 'Failed to fetch communication' });
  }
});

// Send message
router.post('/send', [
  body('recipientId').isInt(),
  body('subject').notEmpty().trim(),
  body('message').notEmpty().trim(),
  body('type').isIn(['email', 'sms', 'notification', 'announcement'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipientId, subject, message, type, priority, attachments, scheduledAt } = req.body;
    const senderId = req.user.userId;

    // Check if recipient exists
    const [recipients] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [recipientId]
    );

    if (recipients.length === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Insert communication
    const [result] = await pool.execute(
      'INSERT INTO communications (senderId, recipientId, type, subject, message, priority, attachments, scheduledAt, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "sent", NOW())',
      [senderId, recipientId, type, subject, message, priority || 'normal', JSON.stringify(attachments || []), scheduledAt]
    );

    res.status(201).json({
      message: 'Message sent successfully',
      communicationId: result.insertId
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Send bulk message
router.post('/send-bulk', [
  body('recipientIds').isArray(),
  body('subject').notEmpty().trim(),
  body('message').notEmpty().trim(),
  body('type').isIn(['email', 'sms', 'notification', 'announcement'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipientIds, subject, message, type, priority, attachments, scheduledAt } = req.body;
    const senderId = req.user.userId;

    if (recipientIds.length === 0) {
      return res.status(400).json({ error: 'No recipients specified' });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const recipientId of recipientIds) {
        try {
          // Check if recipient exists
          const [recipients] = await connection.execute(
            'SELECT id FROM users WHERE id = ?',
            [recipientId]
          );

          if (recipients.length === 0) {
            errors.push(`Recipient ${recipientId} not found`);
            errorCount++;
            continue;
          }

          // Insert communication
          await connection.execute(
            'INSERT INTO communications (senderId, recipientId, type, subject, message, priority, attachments, scheduledAt, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "sent", NOW())',
            [senderId, recipientId, type, subject, message, priority || 'normal', JSON.stringify(attachments || []), scheduledAt]
          );

          successCount++;

        } catch (error) {
          errors.push(`Error sending to recipient ${recipientId}: ${error.message}`);
          errorCount++;
        }
      }

      await connection.commit();

      res.json({
        message: 'Bulk message sent successfully',
        successCount,
        errorCount,
        errors: errors.slice(0, 10) // Limit error messages
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Send bulk message error:', error);
    res.status(500).json({ error: 'Failed to send bulk message' });
  }
});

// Update communication status
router.put('/:id/status', [
  body('status').isIn(['sent', 'delivered', 'read', 'failed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Check if communication exists
    const [communications] = await pool.execute(
      'SELECT id FROM communications WHERE id = ?',
      [id]
    );

    if (communications.length === 0) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    // Update status
    await pool.execute(
      'UPDATE communications SET status = ?, updatedAt = NOW() WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Communication status updated successfully' });

  } catch (error) {
    console.error('Update communication status error:', error);
    res.status(500).json({ error: 'Failed to update communication status' });
  }
});

// Mark as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if communication exists
    const [communications] = await pool.execute(
      'SELECT id FROM communications WHERE id = ?',
      [id]
    );

    if (communications.length === 0) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    // Mark as read
    await pool.execute(
      'UPDATE communications SET status = "read", readAt = NOW(), updatedAt = NOW() WHERE id = ?',
      [id]
    );

    res.json({ message: 'Communication marked as read' });

  } catch (error) {
    console.error('Mark communication as read error:', error);
    res.status(500).json({ error: 'Failed to mark communication as read' });
  }
});

// Delete communication
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if communication exists
    const [communications] = await pool.execute(
      'SELECT id FROM communications WHERE id = ?',
      [id]
    );

    if (communications.length === 0) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    // Delete communication
    await pool.execute('DELETE FROM communications WHERE id = ?', [id]);

    res.json({ message: 'Communication deleted successfully' });

  } catch (error) {
    console.error('Delete communication error:', error);
    res.status(500).json({ error: 'Failed to delete communication' });
  }
});

// Get user inbox
router.get('/inbox/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, unreadOnly = false } = req.query;

    let query = `
      SELECT c.*, 
             s.firstName as senderFirstName, s.lastName as senderLastName, s.email as senderEmail
      FROM communications c
      LEFT JOIN users s ON c.senderId = s.id
      WHERE c.recipientId = ? AND c.status != 'cancelled'
    `;

    const queryParams = [userId];

    if (unreadOnly === 'true') {
      query += ' AND c.status != "read"';
    }

    query += ' ORDER BY c.createdAt DESC LIMIT ?';
    queryParams.push(parseInt(limit));

    const [communications] = await pool.execute(query, queryParams);

    res.json(communications);

  } catch (error) {
    console.error('Get user inbox error:', error);
    res.status(500).json({ error: 'Failed to fetch user inbox' });
  }
});

// Get user sent messages
router.get('/sent/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    const [communications] = await pool.execute(`
      SELECT c.*, 
             r.firstName as recipientFirstName, r.lastName as recipientLastName, r.email as recipientEmail
      FROM communications c
      LEFT JOIN users r ON c.recipientId = r.id
      WHERE c.senderId = ? AND c.status != 'cancelled'
      ORDER BY c.createdAt DESC
      LIMIT ?
    `, [userId, parseInt(limit)]);

    res.json(communications);

  } catch (error) {
    console.error('Get user sent messages error:', error);
    res.status(500).json({ error: 'Failed to fetch sent messages' });
  }
});

// Get communication count for user
router.get('/count/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [counts] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status != 'read' THEN 1 ELSE 0 END) as unread
      FROM communications 
      WHERE recipientId = ? AND status != 'cancelled'
    `, [userId]);

    res.json(counts[0] || { total: 0, unread: 0 });

  } catch (error) {
    console.error('Get communication count error:', error);
    res.status(500).json({ error: 'Failed to fetch communication count' });
  }
});

// Get communication statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalCommunications,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sentCommunications,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as deliveredCommunications,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as readCommunications,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failedCommunications,
        COUNT(CASE WHEN type = 'email' THEN 1 END) as emailCommunications,
        COUNT(CASE WHEN type = 'sms' THEN 1 END) as smsCommunications,
        COUNT(CASE WHEN type = 'notification' THEN 1 END) as notificationCommunications,
        COUNT(CASE WHEN type = 'announcement' THEN 1 END) as announcementCommunications
      FROM communications
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get communication stats error:', error);
    res.status(500).json({ error: 'Failed to fetch communication statistics' });
  }
});

module.exports = router;
