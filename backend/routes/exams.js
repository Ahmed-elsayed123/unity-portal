const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all exams
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, courseId, type, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT e.*, c.name as courseName, c.code as courseCode,
             l.firstName as lecturerFirstName, l.lastName as lecturerLastName,
             COUNT(DISTINCT er.studentId) as enrolledStudents
      FROM exams e
      JOIN courses c ON e.courseId = c.id
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN users u ON l.userId = u.id
      LEFT JOIN enrollments er ON c.id = er.courseId
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (courseId) {
      query += ' AND e.courseId = ?';
      queryParams.push(courseId);
    }

    if (type) {
      query += ' AND e.type = ?';
      queryParams.push(type);
    }

    if (status === 'upcoming') {
      query += ' AND e.examDate >= NOW()';
    } else if (status === 'past') {
      query += ' AND e.examDate < NOW()';
    }

    if (search) {
      query += ' AND (e.title LIKE ? OR e.description LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    query += ' GROUP BY e.id ORDER BY e.examDate ASC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [exams] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM exams e
      WHERE 1=1
    `;
    const countParams = [];

    if (courseId) {
      countQuery += ' AND e.courseId = ?';
      countParams.push(courseId);
    }

    if (type) {
      countQuery += ' AND e.type = ?';
      countParams.push(type);
    }

    if (status === 'upcoming') {
      countQuery += ' AND e.examDate >= NOW()';
    } else if (status === 'past') {
      countQuery += ' AND e.examDate < NOW()';
    }

    if (search) {
      countQuery += ' AND (e.title LIKE ? OR e.description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      exams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// Get exam by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [exams] = await pool.execute(`
      SELECT e.*, c.name as courseName, c.code as courseCode,
             l.firstName as lecturerFirstName, l.lastName as lecturerLastName
      FROM exams e
      JOIN courses c ON e.courseId = c.id
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN users u ON l.userId = u.id
      WHERE e.id = ?
    `, [id]);

    if (exams.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Get enrolled students
    const [students] = await pool.execute(`
      SELECT s.*, u.firstName, u.lastName, u.email, e.enrollmentDate
      FROM enrollments e
      JOIN students s ON e.studentId = s.id
      JOIN users u ON s.userId = u.id
      WHERE e.courseId = ?
      ORDER BY u.lastName, u.firstName
    `, [exams[0].courseId]);

    res.json({
      exam: exams[0],
      students
    });

  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
});

// Create exam
router.post('/', [
  body('courseId').isInt(),
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('examDate').isISO8601(),
  body('duration').isInt({ min: 1 }),
  body('maxPoints').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, title, description, examDate, duration, maxPoints, type, instructions, location } = req.body;

    // Check if course exists
    const [courses] = await pool.execute(
      'SELECT id FROM courses WHERE id = ?',
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Insert exam
    const [result] = await pool.execute(
      'INSERT INTO exams (courseId, title, description, examDate, duration, maxPoints, type, instructions, location, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [courseId, title, description, examDate, duration, maxPoints, type || 'exam', instructions, location]
    );

    res.status(201).json({
      message: 'Exam created successfully',
      examId: result.insertId
    });

  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// Update exam
router.put('/:id', [
  body('title').optional().notEmpty().trim(),
  body('description').optional().notEmpty().trim(),
  body('examDate').optional().isISO8601(),
  body('duration').optional().isInt({ min: 1 }),
  body('maxPoints').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, examDate, duration, maxPoints, type, instructions, location } = req.body;

    // Check if exam exists
    const [exams] = await pool.execute(
      'SELECT id FROM exams WHERE id = ?',
      [id]
    );

    if (exams.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
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
    if (examDate) {
      updateFields.push('examDate = ?');
      updateValues.push(examDate);
    }
    if (duration) {
      updateFields.push('duration = ?');
      updateValues.push(duration);
    }
    if (maxPoints) {
      updateFields.push('maxPoints = ?');
      updateValues.push(maxPoints);
    }
    if (type) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (instructions) {
      updateFields.push('instructions = ?');
      updateValues.push(instructions);
    }
    if (location) {
      updateFields.push('location = ?');
      updateValues.push(location);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(id);

    await pool.execute(
      `UPDATE exams SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Exam updated successfully' });

  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ error: 'Failed to update exam' });
  }
});

// Delete exam
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if exam exists
    const [exams] = await pool.execute(
      'SELECT id FROM exams WHERE id = ?',
      [id]
    );

    if (exams.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Delete exam
    await pool.execute('DELETE FROM exams WHERE id = ?', [id]);

    res.json({ message: 'Exam deleted successfully' });

  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

// Get upcoming exams for student
router.get('/student/:studentId/upcoming', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 10 } = req.query;

    const [exams] = await pool.execute(`
      SELECT e.*, c.name as courseName, c.code as courseCode,
             l.firstName as lecturerFirstName, l.lastName as lecturerLastName
      FROM exams e
      JOIN courses c ON e.courseId = c.id
      JOIN enrollments en ON c.id = en.courseId
      JOIN students s ON en.studentId = s.id
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN users u ON l.userId = u.id
      WHERE s.id = ? AND e.examDate >= NOW()
      ORDER BY e.examDate ASC
      LIMIT ?
    `, [studentId, parseInt(limit)]);

    res.json(exams);

  } catch (error) {
    console.error('Get upcoming exams error:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming exams' });
  }
});

// Get exam schedule
router.get('/schedule/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { month, year } = req.query;

    let query = `
      SELECT e.*, c.name as courseName, c.code as courseCode
      FROM exams e
      JOIN courses c ON e.courseId = c.id
      WHERE e.courseId = ?
    `;

    const queryParams = [courseId];

    if (month) {
      query += ' AND MONTH(e.examDate) = ?';
      queryParams.push(month);
    }

    if (year) {
      query += ' AND YEAR(e.examDate) = ?';
      queryParams.push(year);
    }

    query += ' ORDER BY e.examDate ASC';

    const [exams] = await pool.execute(query, queryParams);

    res.json(exams);

  } catch (error) {
    console.error('Get exam schedule error:', error);
    res.status(500).json({ error: 'Failed to fetch exam schedule' });
  }
});

// Get exam statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalExams,
        COUNT(CASE WHEN examDate >= NOW() THEN 1 END) as upcomingExams,
        COUNT(CASE WHEN examDate < NOW() THEN 1 END) as pastExams,
        COUNT(CASE WHEN type = 'midterm' THEN 1 END) as midtermExams,
        COUNT(CASE WHEN type = 'final' THEN 1 END) as finalExams,
        COUNT(CASE WHEN type = 'quiz' THEN 1 END) as quizExams,
        AVG(duration) as averageDuration,
        AVG(maxPoints) as averageMaxPoints
      FROM exams
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get exam stats error:', error);
    res.status(500).json({ error: 'Failed to fetch exam statistics' });
  }
});

module.exports = router;
