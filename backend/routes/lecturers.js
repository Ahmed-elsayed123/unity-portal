const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get lecturer dashboard data
router.get('/dashboard/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get lecturer info
    const [lecturers] = await pool.execute(`
      SELECT l.*, u.firstName, u.lastName, u.email, d.name as departmentName
      FROM lecturers l
      JOIN users u ON l.userId = u.id
      LEFT JOIN departments d ON l.departmentId = d.id
      WHERE l.userId = ?
    `, [id]);

    if (lecturers.length === 0) {
      return res.status(404).json({ error: 'Lecturer not found' });
    }

    const lecturer = lecturers[0];

    // Get courses count
    const [courseCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM courses WHERE lecturerId = ?',
      [lecturer.id]
    );

    // Get students count
    const [studentCount] = await pool.execute(`
      SELECT COUNT(DISTINCT e.studentId) as count 
      FROM enrollments e
      JOIN courses c ON e.courseId = c.id
      WHERE c.lecturerId = ?
    `, [lecturer.id]);

    // Get pending assignments to grade
    const [pendingGrading] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM submissions s
      JOIN assignments a ON s.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      WHERE c.lecturerId = ? AND s.status = 'submitted' AND s.grade IS NULL
    `, [lecturer.id]);

    // Get recent announcements
    const [recentAnnouncements] = await pool.execute(`
      SELECT * FROM announcements 
      WHERE targetGroup = 'lecturers' OR targetGroup = 'all'
      ORDER BY createdAt DESC
      LIMIT 5
    `);

    res.json({
      lecturer,
      stats: {
        totalCourses: courseCount[0].count,
        totalStudents: studentCount[0].count,
        pendingGrading: pendingGrading[0].count
      },
      recentAnnouncements
    });

  } catch (error) {
    console.error('Get lecturer dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch lecturer dashboard' });
  }
});

// Get lecturer courses
router.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { semester, year } = req.query;

    let query = `
      SELECT c.*, d.name as departmentName,
             COUNT(e.studentId) as enrolledStudents
      FROM courses c
      JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN departments d ON l.departmentId = d.id
      LEFT JOIN enrollments e ON c.id = e.courseId
      WHERE l.userId = ?
    `;

    const queryParams = [id];

    if (semester) {
      query += ' AND c.semester = ?';
      queryParams.push(semester);
    }

    if (year) {
      query += ' AND c.year = ?';
      queryParams.push(year);
    }

    query += ' GROUP BY c.id ORDER BY c.name ASC';

    const [courses] = await pool.execute(query, queryParams);

    res.json(courses);

  } catch (error) {
    console.error('Get lecturer courses error:', error);
    res.status(500).json({ error: 'Failed to fetch lecturer courses' });
  }
});

// Get students in lecturer's courses
router.get('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, search } = req.query;

    let query = `
      SELECT DISTINCT s.*, u.firstName, u.lastName, u.email, u.phone,
             p.name as programName, f.name as facultyName,
             e.enrollmentDate, e.status as enrollmentStatus
      FROM students s
      JOIN users u ON s.userId = u.id
      JOIN enrollments e ON s.id = e.studentId
      JOIN courses c ON e.courseId = c.id
      JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN programs p ON s.programId = p.id
      LEFT JOIN faculties f ON p.facultyId = f.id
      WHERE l.userId = ?
    `;

    const queryParams = [id];

    if (courseId) {
      query += ' AND c.id = ?';
      queryParams.push(courseId);
    }

    if (search) {
      query += ' AND (u.firstName LIKE ? OR u.lastName LIKE ? OR u.email LIKE ? OR s.studentId LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY u.lastName, u.firstName ASC';

    const [students] = await pool.execute(query, queryParams);

    res.json(students);

  } catch (error) {
    console.error('Get lecturer students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get assignments for lecturer's courses
router.get('/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, status } = req.query;

    let query = `
      SELECT a.*, c.name as courseName, c.code as courseCode,
             COUNT(s.id) as submissionCount,
             COUNT(CASE WHEN s.status = 'submitted' THEN 1 END) as submittedCount,
             COUNT(CASE WHEN s.grade IS NOT NULL THEN 1 END) as gradedCount
      FROM assignments a
      JOIN courses c ON a.courseId = c.id
      JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN submissions s ON a.id = s.assignmentId
      WHERE l.userId = ?
    `;

    const queryParams = [id];

    if (courseId) {
      query += ' AND c.id = ?';
      queryParams.push(courseId);
    }

    if (status === 'pending') {
      query += ' AND a.dueDate >= NOW()';
    } else if (status === 'overdue') {
      query += ' AND a.dueDate < NOW()';
    }

    query += ' GROUP BY a.id ORDER BY a.dueDate DESC';

    const [assignments] = await pool.execute(query, queryParams);

    res.json(assignments);

  } catch (error) {
    console.error('Get lecturer assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Create assignment
router.post('/assignments', [
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

    const { courseId, title, description, dueDate, maxPoints, type, attachments } = req.body;
    const lecturerId = req.user.userId;

    // Verify lecturer owns the course
    const [courses] = await pool.execute(`
      SELECT c.id FROM courses c
      JOIN lecturers l ON c.lecturerId = l.id
      WHERE c.id = ? AND l.userId = ?
    `, [courseId, lecturerId]);

    if (courses.length === 0) {
      return res.status(403).json({ error: 'You can only create assignments for your own courses' });
    }

    // Insert assignment
    const [result] = await pool.execute(
      'INSERT INTO assignments (courseId, title, description, dueDate, maxPoints, type, attachments, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [courseId, title, description, dueDate, maxPoints, type || 'assignment', JSON.stringify(attachments || [])]
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

// Grade assignment
router.post('/assignments/grade', [
  body('submissionId').isInt(),
  body('grade').isFloat({ min: 0 }),
  body('feedback').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { submissionId, grade, feedback } = req.body;
    const lecturerId = req.user.userId;

    // Verify lecturer can grade this submission
    const [submissions] = await pool.execute(`
      SELECT s.*, a.maxPoints, c.id as courseId
      FROM submissions s
      JOIN assignments a ON s.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      JOIN lecturers l ON c.lecturerId = l.id
      WHERE s.id = ? AND l.userId = ?
    `, [submissionId, lecturerId]);

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

// Get submissions for grading
router.get('/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { assignmentId, courseId, status } = req.query;

    let query = `
      SELECT s.*, a.title as assignmentTitle, a.maxPoints,
             u.firstName, u.lastName, u.email,
             c.name as courseName, c.code as courseCode
      FROM submissions s
      JOIN assignments a ON s.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      JOIN lecturers l ON c.lecturerId = l.id
      JOIN students st ON s.studentId = st.id
      JOIN users u ON st.userId = u.id
      WHERE l.userId = ?
    `;

    const queryParams = [id];

    if (assignmentId) {
      query += ' AND a.id = ?';
      queryParams.push(assignmentId);
    }

    if (courseId) {
      query += ' AND c.id = ?';
      queryParams.push(courseId);
    }

    if (status === 'graded') {
      query += ' AND s.grade IS NOT NULL';
    } else if (status === 'ungraded') {
      query += ' AND s.grade IS NULL';
    }

    query += ' ORDER BY s.submittedAt DESC';

    const [submissions] = await pool.execute(query, queryParams);

    res.json(submissions);

  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Mark attendance
router.post('/attendance', [
  body('courseId').isInt(),
  body('date').isISO8601(),
  body('attendance').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, date, attendance } = req.body;
    const lecturerId = req.user.userId;

    // Verify lecturer owns the course
    const [courses] = await pool.execute(`
      SELECT c.id FROM courses c
      JOIN lecturers l ON c.lecturerId = l.id
      WHERE c.id = ? AND l.userId = ?
    `, [courseId, lecturerId]);

    if (courses.length === 0) {
      return res.status(403).json({ error: 'You can only mark attendance for your own courses' });
    }

    // Insert attendance records
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      for (const record of attendance) {
        await connection.execute(
          'INSERT INTO attendance (courseId, studentId, date, status, createdAt) VALUES (?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE status = VALUES(status)',
          [courseId, record.studentId, date, record.status]
        );
      }

      await connection.commit();
      res.json({ message: 'Attendance marked successfully' });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Get lecturer profile
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [profiles] = await pool.execute(`
      SELECT l.*, u.firstName, u.lastName, u.email, u.phone, u.address, u.dateOfBirth,
             d.name as departmentName, d.head as departmentHead
      FROM lecturers l
      JOIN users u ON l.userId = u.id
      LEFT JOIN departments d ON l.departmentId = d.id
      WHERE l.userId = ?
    `, [id]);

    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Lecturer profile not found' });
    }

    res.json(profiles[0]);

  } catch (error) {
    console.error('Get lecturer profile error:', error);
    res.status(500).json({ error: 'Failed to fetch lecturer profile' });
  }
});

// Update lecturer profile
router.put('/profile/:id', [
  body('firstName').optional().notEmpty().trim(),
  body('lastName').optional().notEmpty().trim(),
  body('phone').optional().isMobilePhone(),
  body('address').optional().notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { firstName, lastName, phone, address, dateOfBirth, specialization, qualifications } = req.body;

    // Update user info
    const updateFields = [];
    const updateValues = [];

    if (firstName) {
      updateFields.push('firstName = ?');
      updateValues.push(firstName);
    }
    if (lastName) {
      updateFields.push('lastName = ?');
      updateValues.push(lastName);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (address) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (dateOfBirth) {
      updateFields.push('dateOfBirth = ?');
      updateValues.push(dateOfBirth);
    }

    if (updateFields.length > 0) {
      updateFields.push('updatedAt = NOW()');
      updateValues.push(id);

      await pool.execute(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Update lecturer-specific info
    const lecturerUpdateFields = [];
    const lecturerUpdateValues = [];

    if (specialization) {
      lecturerUpdateFields.push('specialization = ?');
      lecturerUpdateValues.push(specialization);
    }
    if (qualifications) {
      lecturerUpdateFields.push('qualifications = ?');
      lecturerUpdateValues.push(JSON.stringify(qualifications));
    }

    if (lecturerUpdateFields.length > 0) {
      lecturerUpdateFields.push('updatedAt = NOW()');
      lecturerUpdateValues.push(id);

      await pool.execute(
        `UPDATE lecturers SET ${lecturerUpdateFields.join(', ')} WHERE userId = ?`,
        lecturerUpdateValues
      );
    }

    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update lecturer profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
