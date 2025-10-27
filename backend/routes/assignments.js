const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, courseId, status, type, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, c.name as courseName, c.code as courseCode,
             l.firstName as lecturerFirstName, l.lastName as lecturerLastName,
             COUNT(s.id) as submissionCount,
             COUNT(CASE WHEN s.status = 'submitted' THEN 1 END) as submittedCount
      FROM assignments a
      JOIN courses c ON a.courseId = c.id
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN users u ON l.userId = u.id
      LEFT JOIN submissions s ON a.id = s.assignmentId
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (courseId) {
      query += ' AND a.courseId = ?';
      queryParams.push(courseId);
    }

    if (type) {
      query += ' AND a.type = ?';
      queryParams.push(type);
    }

    if (status === 'active') {
      query += ' AND a.dueDate >= NOW()';
    } else if (status === 'overdue') {
      query += ' AND a.dueDate < NOW()';
    }

    if (search) {
      query += ' AND (a.title LIKE ? OR a.description LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    query += ' GROUP BY a.id ORDER BY a.dueDate DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [assignments] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT a.id) as total 
      FROM assignments a
      JOIN courses c ON a.courseId = c.id
      WHERE 1=1
    `;
    const countParams = [];

    if (courseId) {
      countQuery += ' AND a.courseId = ?';
      countParams.push(courseId);
    }

    if (type) {
      countQuery += ' AND a.type = ?';
      countParams.push(type);
    }

    if (status === 'active') {
      countQuery += ' AND a.dueDate >= NOW()';
    } else if (status === 'overdue') {
      countQuery += ' AND a.dueDate < NOW()';
    }

    if (search) {
      countQuery += ' AND (a.title LIKE ? OR a.description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      assignments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [assignments] = await pool.execute(`
      SELECT a.*, c.name as courseName, c.code as courseCode,
             l.firstName as lecturerFirstName, l.lastName as lecturerLastName
      FROM assignments a
      JOIN courses c ON a.courseId = c.id
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN users u ON l.userId = u.id
      WHERE a.id = ?
    `, [id]);

    if (assignments.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Get submissions
    const [submissions] = await pool.execute(`
      SELECT s.*, u.firstName, u.lastName, u.email, st.studentId
      FROM submissions s
      JOIN students st ON s.studentId = st.id
      JOIN users u ON st.userId = u.id
      WHERE s.assignmentId = ?
      ORDER BY s.submittedAt DESC
    `, [id]);

    res.json({
      assignment: assignments[0],
      submissions
    });

  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Create assignment
router.post('/', [
  body('courseId').isInt(),
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('dueDate').isISO8601(),
  body('maxPoints').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, title, description, dueDate, maxPoints, type, attachments, instructions } = req.body;

    // Check if course exists
    const [courses] = await pool.execute(
      'SELECT id FROM courses WHERE id = ?',
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Insert assignment
    const [result] = await pool.execute(
      'INSERT INTO assignments (courseId, title, description, dueDate, maxPoints, type, attachments, instructions, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [courseId, title, description, dueDate, maxPoints, type || 'assignment', JSON.stringify(attachments || []), instructions]
    );

    res.status(201).json({
      message: 'Assignment created successfully',
      assignmentId: result.insertId
    });

  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Update assignment
router.put('/:id', [
  body('title').optional().notEmpty().trim(),
  body('description').optional().notEmpty().trim(),
  body('dueDate').optional().isISO8601(),
  body('maxPoints').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, dueDate, maxPoints, type, attachments, instructions } = req.body;

    // Check if assignment exists
    const [assignments] = await pool.execute(
      'SELECT id FROM assignments WHERE id = ?',
      [id]
    );

    if (assignments.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (dueDate) {
      updateFields.push('dueDate = ?');
      updateValues.push(dueDate);
    }
    if (maxPoints) {
      updateFields.push('maxPoints = ?');
      updateValues.push(maxPoints);
    }
    if (type) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (attachments) {
      updateFields.push('attachments = ?');
      updateValues.push(JSON.stringify(attachments));
    }
    if (instructions) {
      updateFields.push('instructions = ?');
      updateValues.push(instructions);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(id);

    await pool.execute(
      `UPDATE assignments SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Assignment updated successfully' });

  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// Delete assignment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if assignment exists
    const [assignments] = await pool.execute(
      'SELECT id FROM assignments WHERE id = ?',
      [id]
    );

    if (assignments.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if assignment has submissions
    const [submissions] = await pool.execute(
      'SELECT COUNT(*) as count FROM submissions WHERE assignmentId = ?',
      [id]
    );

    if (submissions[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete assignment with submissions' });
    }

    // Delete assignment
    await pool.execute('DELETE FROM assignments WHERE id = ?', [id]);

    res.json({ message: 'Assignment deleted successfully' });

  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

// Submit assignment
router.post('/:id/submit', [
  body('content').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { content, attachments } = req.body;
    const studentId = req.user.userId;

    // Get student record
    const [students] = await pool.execute(
      'SELECT id FROM students WHERE userId = ?',
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentRecordId = students[0].id;

    // Check if assignment exists and is not past due
    const [assignments] = await pool.execute(
      'SELECT * FROM assignments WHERE id = ? AND dueDate >= NOW()',
      [id]
    );

    if (assignments.length === 0) {
      return res.status(400).json({ error: 'Assignment not found or past due' });
    }

    // Check if already submitted
    const [existingSubmissions] = await pool.execute(
      'SELECT id FROM submissions WHERE assignmentId = ? AND studentId = ?',
      [id, studentRecordId]
    );

    if (existingSubmissions.length > 0) {
      return res.status(400).json({ error: 'Assignment already submitted' });
    }

    // Insert submission
    await pool.execute(
      'INSERT INTO submissions (assignmentId, studentId, content, attachments, submittedAt, status) VALUES (?, ?, ?, ?, NOW(), "submitted")',
      [id, studentRecordId, content, JSON.stringify(attachments || [])]
    );

    res.json({ message: 'Assignment submitted successfully' });

  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

// Grade assignment
router.post('/:id/grade', [
  body('submissionId').isInt(),
  body('grade').isFloat({ min: 0 }),
  body('feedback').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { submissionId, grade, feedback } = req.body;
    const lecturerId = req.user.userId;

    // Verify lecturer can grade this submission
    const [submissions] = await pool.execute(`
      SELECT s.*, a.maxPoints, c.id as courseId
      FROM submissions s
      JOIN assignments a ON s.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      JOIN lecturers l ON c.lecturerId = l.id
      WHERE s.id = ? AND l.userId = ? AND a.id = ?
    `, [submissionId, lecturerId, id]);

    if (submissions.length === 0) {
      return res.status(403).json({ error: 'You can only grade submissions for your own courses' });
    }

    const submission = submissions[0];

    if (grade > submission.maxPoints) {
      return res.status(400).json({ error: 'Grade cannot exceed maximum points' });
    }

    // Update submission with grade
    await pool.execute(
      'UPDATE submissions SET grade = ?, feedback = ?, gradedAt = NOW() WHERE id = ?',
      [grade, feedback, submissionId]
    );

    // Insert or update grade record
    await pool.execute(`
      INSERT INTO grades (assignmentId, studentId, grade, feedback, createdAt)
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE grade = VALUES(grade), feedback = VALUES(feedback), updatedAt = NOW()
    `, [submission.assignmentId, submission.studentId, grade, feedback]);

    res.json({ message: 'Assignment graded successfully' });

  } catch (error) {
    console.error('Grade assignment error:', error);
    res.status(500).json({ error: 'Failed to grade assignment' });
  }
});

// Get assignment statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalAssignments,
        COUNT(CASE WHEN dueDate >= NOW() THEN 1 END) as activeAssignments,
        COUNT(CASE WHEN dueDate < NOW() THEN 1 END) as overdueAssignments,
        AVG(maxPoints) as averageMaxPoints,
        COUNT(DISTINCT courseId) as coursesWithAssignments
      FROM assignments
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get assignment stats error:', error);
    res.status(500).json({ error: 'Failed to fetch assignment statistics' });
  }
});

module.exports = router;
