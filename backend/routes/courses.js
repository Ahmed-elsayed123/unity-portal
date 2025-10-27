const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, semester, year, department, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT c.*, l.firstName as lecturerFirstName, l.lastName as lecturerLastName,
             d.name as departmentName, p.name as programName,
             COUNT(e.studentId) as enrolledStudents
      FROM courses c
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN users u ON l.userId = u.id
      LEFT JOIN departments d ON l.departmentId = d.id
      LEFT JOIN programs p ON c.programId = p.id
      LEFT JOIN enrollments e ON c.id = e.courseId
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (semester) {
      query += ' AND c.semester = ?';
      queryParams.push(semester);
    }

    if (year) {
      query += ' AND c.year = ?';
      queryParams.push(year);
    }

    if (department) {
      query += ' AND d.id = ?';
      queryParams.push(department);
    }

    if (search) {
      query += ' AND (c.name LIKE ? OR c.code LIKE ? OR c.description LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' GROUP BY c.id ORDER BY c.name ASC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [courses] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT c.id) as total 
      FROM courses c
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN departments d ON l.departmentId = d.id
      WHERE 1=1
    `;
    const countParams = [];

    if (semester) {
      countQuery += ' AND c.semester = ?';
      countParams.push(semester);
    }

    if (year) {
      countQuery += ' AND c.year = ?';
      countParams.push(year);
    }

    if (department) {
      countQuery += ' AND d.id = ?';
      countParams.push(department);
    }

    if (search) {
      countQuery += ' AND (c.name LIKE ? OR c.code LIKE ? OR c.description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [courses] = await pool.execute(`
      SELECT c.*, l.firstName as lecturerFirstName, l.lastName as lecturerLastName,
             d.name as departmentName, p.name as programName,
             COUNT(e.studentId) as enrolledStudents
      FROM courses c
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN users u ON l.userId = u.id
      LEFT JOIN departments d ON l.departmentId = d.id
      LEFT JOIN programs p ON c.programId = p.id
      LEFT JOIN enrollments e ON c.id = e.courseId
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get enrolled students
    const [students] = await pool.execute(`
      SELECT s.*, u.firstName, u.lastName, u.email, e.enrollmentDate, e.status
      FROM enrollments e
      JOIN students s ON e.studentId = s.id
      JOIN users u ON s.userId = u.id
      WHERE e.courseId = ?
      ORDER BY u.lastName, u.firstName
    `, [id]);

    // Get assignments
    const [assignments] = await pool.execute(`
      SELECT a.*, COUNT(s.id) as submissionCount
      FROM assignments a
      LEFT JOIN submissions s ON a.id = s.assignmentId
      WHERE a.courseId = ?
      GROUP BY a.id
      ORDER BY a.dueDate DESC
    `, [id]);

    res.json({
      course: courses[0],
      students,
      assignments
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Create course (Admin/Lecturer)
router.post('/', [
  body('name').notEmpty().trim(),
  body('code').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('credits').isInt({ min: 1 }),
  body('semester').isIn(['1', '2', '3', '4', '5', '6', '7', '8']),
  body('year').isInt({ min: 2020 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, code, description, credits, semester, year, lecturerId, programId, prerequisites } = req.body;

    // Check if course code already exists
    const [existingCourses] = await pool.execute(
      'SELECT id FROM courses WHERE code = ?',
      [code]
    );

    if (existingCourses.length > 0) {
      return res.status(400).json({ error: 'Course code already exists' });
    }

    // Insert course
    const [result] = await pool.execute(
      'INSERT INTO courses (name, code, description, credits, semester, year, lecturerId, programId, prerequisites, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [name, code, description, credits, semester, year, lecturerId, JSON.stringify(prerequisites || [])]
    );

    res.status(201).json({
      message: 'Course created successfully',
      courseId: result.insertId
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course
router.put('/:id', [
  body('name').optional().notEmpty().trim(),
  body('code').optional().notEmpty().trim(),
  body('description').optional().notEmpty().trim(),
  body('credits').optional().isInt({ min: 1 }),
  body('semester').optional().isIn(['1', '2', '3', '4', '5', '6', '7', '8']),
  body('year').optional().isInt({ min: 2020 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, code, description, credits, semester, year, lecturerId, programId, prerequisites } = req.body;

    // Check if course exists
    const [courses] = await pool.execute(
      'SELECT id FROM courses WHERE id = ?',
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if course code already exists (excluding current course)
    if (code) {
      const [existingCourses] = await pool.execute(
        'SELECT id FROM courses WHERE code = ? AND id != ?',
        [code, id]
      );

      if (existingCourses.length > 0) {
        return res.status(400).json({ error: 'Course code already exists' });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (code) {
      updateFields.push('code = ?');
      updateValues.push(code);
    }
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (credits) {
      updateFields.push('credits = ?');
      updateValues.push(credits);
    }
    if (semester) {
      updateFields.push('semester = ?');
      updateValues.push(semester);
    }
    if (year) {
      updateFields.push('year = ?');
      updateValues.push(year);
    }
    if (lecturerId) {
      updateFields.push('lecturerId = ?');
      updateValues.push(lecturerId);
    }
    if (programId) {
      updateFields.push('programId = ?');
      updateValues.push(programId);
    }
    if (prerequisites) {
      updateFields.push('prerequisites = ?');
      updateValues.push(JSON.stringify(prerequisites));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(id);

    await pool.execute(
      `UPDATE courses SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Course updated successfully' });

  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if course exists
    const [courses] = await pool.execute(
      'SELECT id FROM courses WHERE id = ?',
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if course has enrollments
    const [enrollments] = await pool.execute(
      'SELECT COUNT(*) as count FROM enrollments WHERE courseId = ?',
      [id]
    );

    if (enrollments[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete course with active enrollments' });
    }

    // Delete course
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);

    res.json({ message: 'Course deleted successfully' });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Enroll student in course
router.post('/:id/enroll', [
  body('studentId').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { studentId } = req.body;

    // Check if course exists
    const [courses] = await pool.execute(
      'SELECT id FROM courses WHERE id = ?',
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if student exists
    const [students] = await pool.execute(
      'SELECT id FROM students WHERE id = ?',
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if already enrolled
    const [existingEnrollments] = await pool.execute(
      'SELECT id FROM enrollments WHERE courseId = ? AND studentId = ?',
      [id, studentId]
    );

    if (existingEnrollments.length > 0) {
      return res.status(400).json({ error: 'Student already enrolled in this course' });
    }

    // Enroll student
    await pool.execute(
      'INSERT INTO enrollments (courseId, studentId, enrollmentDate, status) VALUES (?, ?, NOW(), "active")',
      [id, studentId]
    );

    res.json({ message: 'Student enrolled successfully' });

  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({ error: 'Failed to enroll student' });
  }
});

// Unenroll student from course
router.delete('/:id/enroll/:studentId', async (req, res) => {
  try {
    const { id, studentId } = req.params;

    // Check if enrollment exists
    const [enrollments] = await pool.execute(
      'SELECT id FROM enrollments WHERE courseId = ? AND studentId = ?',
      [id, studentId]
    );

    if (enrollments.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Remove enrollment
    await pool.execute(
      'DELETE FROM enrollments WHERE courseId = ? AND studentId = ?',
      [id, studentId]
    );

    res.json({ message: 'Student unenrolled successfully' });

  } catch (error) {
    console.error('Unenroll student error:', error);
    res.status(500).json({ error: 'Failed to unenroll student' });
  }
});

// Get course statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalCourses,
        COUNT(CASE WHEN semester = '1' THEN 1 END) as semester1Courses,
        COUNT(CASE WHEN semester = '2' THEN 1 END) as semester2Courses,
        COUNT(CASE WHEN year = YEAR(NOW()) THEN 1 END) as currentYearCourses,
        AVG(credits) as averageCredits,
        SUM(credits) as totalCredits
      FROM courses
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({ error: 'Failed to fetch course statistics' });
  }
});

module.exports = router;
