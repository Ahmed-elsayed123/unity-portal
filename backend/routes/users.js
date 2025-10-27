const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all users (Admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT u.id, u.email, u.firstName, u.lastName, u.role, u.isActive, 
             u.createdAt, u.lastLogin,
             CASE 
               WHEN u.role = 'student' THEN s.studentId
               WHEN u.role = 'lecturer' THEN l.lecturerId
               ELSE NULL
             END as userSpecificId
      FROM users u
      LEFT JOIN students s ON u.id = s.userId
      LEFT JOIN lecturers l ON u.id = l.userId
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (role && role !== 'all') {
      query += ' AND u.role = ?';
      queryParams.push(role);
    }

    if (status && status !== 'all') {
      query += ' AND u.isActive = ?';
      queryParams.push(status === 'active');
    }

    if (search) {
      query += ' AND (u.firstName LIKE ? OR u.lastName LIKE ? OR u.email LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY u.createdAt DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users u WHERE 1=1';
    const countParams = [];

    if (role && role !== 'all') {
      countQuery += ' AND u.role = ?';
      countParams.push(role);
    }

    if (status && status !== 'all') {
      countQuery += ' AND u.isActive = ?';
      countParams.push(status === 'active');
    }

    if (search) {
      countQuery += ' AND (u.firstName LIKE ? OR u.lastName LIKE ? OR u.email LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(`
      SELECT u.*, 
             CASE 
               WHEN u.role = 'student' THEN s.studentId
               WHEN u.role = 'lecturer' THEN l.lecturerId
               ELSE NULL
             END as userSpecificId,
             CASE 
               WHEN u.role = 'student' THEN p.name
               WHEN u.role = 'lecturer' THEN d.name
               ELSE NULL
             END as departmentName
      FROM users u
      LEFT JOIN students s ON u.id = s.userId
      LEFT JOIN lecturers l ON u.id = l.userId
      LEFT JOIN programs p ON s.programId = p.id
      LEFT JOIN departments d ON l.departmentId = d.id
      WHERE u.id = ?
    `, [id]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user (Admin only)
router.post('/', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('role').isIn(['student', 'lecturer', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, role, studentId, lecturerId, departmentId } = req.body;

    // Check if user already exists
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert user
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password, firstName, lastName, role, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
        [email, hashedPassword, firstName, lastName, role]
      );

      const userId = userResult.insertId;

      // Insert role-specific data
      if (role === 'student' && studentId) {
        await connection.execute(
          'INSERT INTO students (userId, studentId, programId, enrollmentDate) VALUES (?, ?, ?, NOW())',
          [userId, studentId, req.body.programId || 1]
        );
      } else if (role === 'lecturer' && lecturerId) {
        await connection.execute(
          'INSERT INTO lecturers (userId, lecturerId, departmentId) VALUES (?, ?, ?)',
          [userId, lecturerId, departmentId || 1]
        );
      } else if (role === 'admin') {
        await connection.execute(
          'INSERT INTO admins (userId, departmentId) VALUES (?, ?)',
          [userId, departmentId || 1]
        );
      }

      await connection.commit();

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: userId,
          email,
          firstName,
          lastName,
          role
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', [
  body('email').optional().isEmail().normalizeEmail(),
  body('firstName').optional().notEmpty().trim(),
  body('lastName').optional().notEmpty().trim(),
  body('role').optional().isIn(['student', 'lecturer', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { email, firstName, lastName, role, isActive } = req.body;

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (firstName) {
      updateFields.push('firstName = ?');
      updateValues.push(firstName);
    }
    if (lastName) {
      updateFields.push('lastName = ?');
      updateValues.push(lastName);
    }
    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (typeof isActive === 'boolean') {
      updateFields.push('isActive = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(id);

    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'User updated successfully' });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Soft delete (deactivate)
    await pool.execute(
      'UPDATE users SET isActive = false, updatedAt = NOW() WHERE id = ?',
      [id]
    );

    res.json({ message: 'User deactivated successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as totalStudents,
        SUM(CASE WHEN role = 'lecturer' THEN 1 ELSE 0 END) as totalLecturers,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as totalAdmins,
        SUM(CASE WHEN isActive = true THEN 1 ELSE 0 END) as activeUsers,
        SUM(CASE WHEN isActive = false THEN 1 ELSE 0 END) as inactiveUsers,
        SUM(CASE WHEN lastLogin >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as recentLogins
      FROM users
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

module.exports = router;
