const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all fees
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, studentId, status, year, semester } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT f.*, s.studentId as studentNumber,
             u.firstName, u.lastName, u.email,
             p.name as programName
      FROM fees f
      JOIN students s ON f.studentId = s.id
      JOIN users u ON s.userId = u.id
      LEFT JOIN programs p ON s.programId = p.id
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (studentId) {
      query += ' AND f.studentId = ?';
      queryParams.push(studentId);
    }

    if (status) {
      query += ' AND f.status = ?';
      queryParams.push(status);
    }

    if (year) {
      query += ' AND YEAR(f.dueDate) = ?';
      queryParams.push(year);
    }

    if (semester) {
      query += ' AND f.semester = ?';
      queryParams.push(semester);
    }

    query += ' ORDER BY f.dueDate DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [fees] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM fees f
      WHERE 1=1
    `;
    const countParams = [];

    if (studentId) {
      countQuery += ' AND f.studentId = ?';
      countParams.push(studentId);
    }

    if (status) {
      countQuery += ' AND f.status = ?';
      countParams.push(status);
    }

    if (year) {
      countQuery += ' AND YEAR(f.dueDate) = ?';
      countParams.push(year);
    }

    if (semester) {
      countQuery += ' AND f.semester = ?';
      countParams.push(semester);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      fees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get fees error:', error);
    res.status(500).json({ error: 'Failed to fetch fees' });
  }
});

// Get fee by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [fees] = await pool.execute(`
      SELECT f.*, s.studentId as studentNumber,
             u.firstName, u.lastName, u.email,
             p.name as programName
      FROM fees f
      JOIN students s ON f.studentId = s.id
      JOIN users u ON s.userId = u.id
      LEFT JOIN programs p ON s.programId = p.id
      WHERE f.id = ?
    `, [id]);

    if (fees.length === 0) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    // Get payment history
    const [payments] = await pool.execute(`
      SELECT p.*, u.firstName, u.lastName
      FROM payments p
      JOIN users u ON p.processedBy = u.id
      WHERE p.feeId = ?
      ORDER BY p.paymentDate DESC
    `, [id]);

    res.json({
      fee: fees[0],
      payments
    });

  } catch (error) {
    console.error('Get fee error:', error);
    res.status(500).json({ error: 'Failed to fetch fee' });
  }
});

// Create fee
router.post('/', [
  body('studentId').isInt(),
  body('amount').isFloat({ min: 0 }),
  body('description').notEmpty().trim(),
  body('dueDate').isISO8601(),
  body('type').isIn(['tuition', 'library', 'lab', 'exam', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, amount, description, dueDate, type, semester, year, notes } = req.body;

    // Check if student exists
    const [students] = await pool.execute(
      'SELECT id FROM students WHERE id = ?',
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Insert fee
    const [result] = await pool.execute(
      'INSERT INTO fees (studentId, amount, description, dueDate, type, semester, year, notes, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "pending", NOW())',
      [studentId, amount, description, dueDate, type, semester, year, notes]
    );

    res.status(201).json({
      message: 'Fee created successfully',
      feeId: result.insertId
    });

  } catch (error) {
    console.error('Create fee error:', error);
    res.status(500).json({ error: 'Failed to create fee' });
  }
});

// Update fee
router.put('/:id', [
  body('amount').optional().isFloat({ min: 0 }),
  body('description').optional().notEmpty().trim(),
  body('dueDate').optional().isISO8601(),
  body('status').optional().isIn(['pending', 'paid', 'overdue', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { amount, description, dueDate, type, semester, year, notes, status } = req.body;

    // Check if fee exists
    const [fees] = await pool.execute(
      'SELECT id FROM fees WHERE id = ?',
      [id]
    );

    if (fees.length === 0) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (amount) {
      updateFields.push('amount = ?');
      updateValues.push(amount);
    }
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (dueDate) {
      updateFields.push('dueDate = ?');
      updateValues.push(dueDate);
    }
    if (type) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (semester) {
      updateFields.push('semester = ?');
      updateValues.push(semester);
    }
    if (year) {
      updateFields.push('year = ?');
      updateValues.push(year);
    }
    if (notes) {
      updateFields.push('notes = ?');
      updateValues.push(notes);
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
      `UPDATE fees SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Fee updated successfully' });

  } catch (error) {
    console.error('Update fee error:', error);
    res.status(500).json({ error: 'Failed to update fee' });
  }
});

// Delete fee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if fee exists
    const [fees] = await pool.execute(
      'SELECT id FROM fees WHERE id = ?',
      [id]
    );

    if (fees.length === 0) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    // Check if fee has payments
    const [payments] = await pool.execute(
      'SELECT COUNT(*) as count FROM payments WHERE feeId = ?',
      [id]
    );

    if (payments[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete fee with payment history' });
    }

    // Delete fee
    await pool.execute('DELETE FROM fees WHERE id = ?', [id]);

    res.json({ message: 'Fee deleted successfully' });

  } catch (error) {
    console.error('Delete fee error:', error);
    res.status(500).json({ error: 'Failed to delete fee' });
  }
});

// Record payment
router.post('/:id/payment', [
  body('amount').isFloat({ min: 0 }),
  body('paymentMethod').isIn(['cash', 'bank_transfer', 'card', 'check', 'other']),
  body('paymentDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { amount, paymentMethod, paymentDate, reference, notes } = req.body;
    const processedBy = req.user.userId;

    // Check if fee exists
    const [fees] = await pool.execute(
      'SELECT amount, status FROM fees WHERE id = ?',
      [id]
    );

    if (fees.length === 0) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    const fee = fees[0];

    if (fee.status === 'paid') {
      return res.status(400).json({ error: 'Fee is already paid' });
    }

    if (amount > fee.amount) {
      return res.status(400).json({ error: 'Payment amount cannot exceed fee amount' });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert payment
      const [paymentResult] = await connection.execute(
        'INSERT INTO payments (feeId, amount, paymentMethod, paymentDate, reference, notes, processedBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [id, amount, paymentMethod, paymentDate, reference, notes, processedBy]
      );

      // Update fee status
      const newStatus = amount >= fee.amount ? 'paid' : 'partial';
      await connection.execute(
        'UPDATE fees SET status = ?, updatedAt = NOW() WHERE id = ?',
        [newStatus, id]
      );

      await connection.commit();

      res.json({
        message: 'Payment recorded successfully',
        paymentId: paymentResult.insertId
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// Get payment history
router.get('/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;

    const [payments] = await pool.execute(`
      SELECT p.*, u.firstName, u.lastName
      FROM payments p
      JOIN users u ON p.processedBy = u.id
      WHERE p.feeId = ?
      ORDER BY p.paymentDate DESC
    `, [id]);

    res.json(payments);

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Get student fee summary
router.get('/student/:studentId/summary', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { year, semester } = req.query;

    let query = `
      SELECT 
        COUNT(*) as totalFees,
        SUM(amount) as totalAmount,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paidAmount,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pendingAmount,
        SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END) as overdueAmount,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paidFees,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingFees,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdueFees
      FROM fees f
      WHERE f.studentId = ?
    `;

    const queryParams = [studentId];

    if (year) {
      query += ' AND f.year = ?';
      queryParams.push(year);
    }

    if (semester) {
      query += ' AND f.semester = ?';
      queryParams.push(semester);
    }

    const [summary] = await pool.execute(query, queryParams);

    res.json(summary[0] || {
      totalFees: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      paidFees: 0,
      pendingFees: 0,
      overdueFees: 0
    });

  } catch (error) {
    console.error('Get student fee summary error:', error);
    res.status(500).json({ error: 'Failed to fetch student fee summary' });
  }
});

// Get fee statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalFees,
        SUM(amount) as totalAmount,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as totalPaid,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as totalPending,
        SUM(CASE WHEN status = 'overdue' THEN amount ELSE 0 END) as totalOverdue,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paidFees,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingFees,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdueFees,
        AVG(amount) as averageFeeAmount
      FROM fees
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get fee stats error:', error);
    res.status(500).json({ error: 'Failed to fetch fee statistics' });
  }
});

module.exports = router;
