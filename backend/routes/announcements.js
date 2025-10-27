const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, targetGroup, status, priority, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, u.firstName, u.lastName, u.email
      FROM announcements a
      JOIN users u ON a.createdBy = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (targetGroup) {
      query += ' AND a.targetGroup = ?';
      queryParams.push(targetGroup);
    }

    if (status) {
      query += ' AND a.status = ?';
      queryParams.push(status);
    }

    if (priority) {
      query += ' AND a.priority = ?';
      queryParams.push(priority);
    }

    if (search) {
      query += ' AND (a.title LIKE ? OR a.content LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY a.createdAt DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [announcements] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM announcements a
      WHERE 1=1
    `;
    const countParams = [];

    if (targetGroup) {
      countQuery += ' AND a.targetGroup = ?';
      countParams.push(targetGroup);
    }

    if (status) {
      countQuery += ' AND a.status = ?';
      countParams.push(status);
    }

    if (priority) {
      countQuery += ' AND a.priority = ?';
      countParams.push(priority);
    }

    if (search) {
      countQuery += ' AND (a.title LIKE ? OR a.content LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      announcements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Get announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [announcements] = await pool.execute(`
      SELECT a.*, u.firstName, u.lastName, u.email
      FROM announcements a
      JOIN users u ON a.createdBy = u.id
      WHERE a.id = ?
    `, [id]);

    if (announcements.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(announcements[0]);

  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
});

// Create announcement
router.post('/', [
  body('title').notEmpty().trim(),
  body('content').notEmpty().trim(),
  body('targetGroup').isIn(['students', 'lecturers', 'staff', 'all']),
  body('priority').isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, targetGroup, priority, attachments, scheduledAt, expiresAt } = req.body;
    const createdBy = req.user.userId;

    // Insert announcement
    const [result] = await pool.execute(
      'INSERT INTO announcements (title, content, targetGroup, priority, attachments, scheduledAt, expiresAt, createdBy, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "active", NOW())',
      [title, content, targetGroup, priority, JSON.stringify(attachments || []), scheduledAt, expiresAt, createdBy]
    );

    res.status(201).json({
      message: 'Announcement created successfully',
      announcementId: result.insertId
    });

  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Update announcement
router.put('/:id', [
  body('title').optional().notEmpty().trim(),
  body('content').optional().notEmpty().trim(),
  body('targetGroup').optional().isIn(['students', 'lecturers', 'staff', 'all']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('status').optional().isIn(['active', 'inactive', 'archived'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, targetGroup, priority, attachments, scheduledAt, expiresAt, status } = req.body;

    // Check if announcement exists
    const [announcements] = await pool.execute(
      'SELECT id FROM announcements WHERE id = ?',
      [id]
    );

    if (announcements.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (content) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (targetGroup) {
      updateFields.push('targetGroup = ?');
      updateValues.push(targetGroup);
    }
    if (priority) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (attachments) {
      updateFields.push('attachments = ?');
      updateValues.push(JSON.stringify(attachments));
    }
    if (scheduledAt) {
      updateFields.push('scheduledAt = ?');
      updateValues.push(scheduledAt);
    }
    if (expiresAt) {
      updateFields.push('expiresAt = ?');
      updateValues.push(expiresAt);
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
      `UPDATE announcements SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Announcement updated successfully' });

  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if announcement exists
    const [announcements] = await pool.execute(
      'SELECT id FROM announcements WHERE id = ?',
      [id]
    );

    if (announcements.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Delete announcement
    await pool.execute('DELETE FROM announcements WHERE id = ?', [id]);

    res.json({ message: 'Announcement deleted successfully' });

  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// Get announcements for specific user role
router.get('/user/:userId/role/:role', async (req, res) => {
  try {
    const { userId, role } = req.params;
    const { limit = 10, priority } = req.query;

    let query = `
      SELECT a.*, u.firstName, u.lastName, u.email
      FROM announcements a
      JOIN users u ON a.createdBy = u.id
      WHERE (a.targetGroup = ? OR a.targetGroup = 'all') 
      AND a.status = 'active'
      AND (a.expiresAt IS NULL OR a.expiresAt >= NOW())
    `;

    const queryParams = [role];

    if (priority) {
      query += ' AND a.priority = ?';
      queryParams.push(priority);
    }

    query += ' ORDER BY a.priority DESC, a.createdAt DESC LIMIT ?';
    queryParams.push(parseInt(limit));

    const [announcements] = await pool.execute(query, queryParams);

    res.json(announcements);

  } catch (error) {
    console.error('Get user announcements error:', error);
    res.status(500).json({ error: 'Failed to fetch user announcements' });
  }
});

// Get announcement statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalAnnouncements,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as activeAnnouncements,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactiveAnnouncements,
        COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgentAnnouncements,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as highPriorityAnnouncements,
        COUNT(CASE WHEN targetGroup = 'students' THEN 1 END) as studentAnnouncements,
        COUNT(CASE WHEN targetGroup = 'lecturers' THEN 1 END) as lecturerAnnouncements,
        COUNT(CASE WHEN targetGroup = 'staff' THEN 1 END) as staffAnnouncements,
        COUNT(CASE WHEN targetGroup = 'all' THEN 1 END) as allAnnouncements
      FROM announcements
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get announcement stats error:', error);
    res.status(500).json({ error: 'Failed to fetch announcement statistics' });
  }
});

module.exports = router;
