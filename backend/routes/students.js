const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get student dashboard data
router.get('/dashboard/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get student info
    const [students] = await pool.execute(`
      SELECT s.*, u.firstName, u.lastName, u.email, p.name as programName, f.name as facultyName
      FROM students s
      JOIN users u ON s.userId = u.id
      LEFT JOIN programs p ON s.programId = p.id
      LEFT JOIN faculties f ON p.facultyId = f.id
      WHERE s.userId = ?
    `, [id]);

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = students[0];

    // Get enrolled courses count
    const [courseCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM enrollments WHERE studentId = ?',
      [student.id]
    );

    // Get assignments count
    const [assignmentCount] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM assignments a
      JOIN enrollments e ON a.courseId = e.courseId
      WHERE e.studentId = ? AND a.dueDate >= NOW()
    `, [student.id]);

    // Get recent grades
    const [recentGrades] = await pool.execute(`
      SELECT g.*, a.title as assignmentTitle, c.name as courseName
      FROM grades g
      JOIN assignments a ON g.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      WHERE g.studentId = ?
      ORDER BY g.createdAt DESC
      LIMIT 5
    `, [student.id]);

    // Get attendance summary
    const [attendanceSummary] = await pool.execute(`
      SELECT 
        COUNT(*) as totalClasses,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as presentClasses,
        ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendancePercentage
      FROM attendance a
      JOIN enrollments e ON a.courseId = e.courseId
      WHERE e.studentId = ? AND a.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `, [student.id]);

    // Get upcoming exams
    const [upcomingExams] = await pool.execute(`
      SELECT e.*, c.name as courseName
      FROM exams e
      JOIN enrollments en ON e.courseId = en.courseId
      JOIN courses c ON e.courseId = c.id
      WHERE en.studentId = ? AND e.examDate >= NOW()
      ORDER BY e.examDate ASC
      LIMIT 5
    `, [student.id]);

    res.json({
      student,
      stats: {
        enrolledCourses: courseCount[0].count,
        pendingAssignments: assignmentCount[0].count,
        attendance: attendanceSummary[0] || { totalClasses: 0, presentClasses: 0, attendancePercentage: 0 }
      },
      recentGrades,
      upcomingExams
    });

  } catch (error) {
    console.error('Get student dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch student dashboard' });
  }
});

// Get student courses
router.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { semester, year } = req.query;

    let query = `
      SELECT c.*, e.enrollmentDate, e.status as enrollmentStatus,
             l.firstName as lecturerFirstName, l.lastName as lecturerLastName,
             p.name as programName, f.name as facultyName
      FROM courses c
      JOIN enrollments e ON c.id = e.courseId
      JOIN students s ON e.studentId = s.id
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN programs p ON s.programId = p.id
      LEFT JOIN faculties f ON p.facultyId = f.id
      WHERE s.userId = ?
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

    query += ' ORDER BY c.name ASC';

    const [courses] = await pool.execute(query, queryParams);

    res.json(courses);

  } catch (error) {
    console.error('Get student courses error:', error);
    res.status(500).json({ error: 'Failed to fetch student courses' });
  }
});

// Get student assignments
router.get('/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, courseId } = req.query;

    let query = `
      SELECT a.*, c.name as courseName, c.code as courseCode,
             l.firstName as lecturerFirstName, l.lastName as lecturerLastName,
             s.id as submissionId, s.submittedAt, s.status as submissionStatus, s.grade
      FROM assignments a
      JOIN courses c ON a.courseId = c.id
      JOIN enrollments e ON c.id = e.courseId
      JOIN students st ON e.studentId = st.id
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN submissions s ON a.id = s.assignmentId AND s.studentId = st.id
      WHERE st.userId = ?
    `;

    const queryParams = [id];

    if (courseId) {
      query += ' AND c.id = ?';
      queryParams.push(courseId);
    }

    if (status === 'submitted') {
      query += ' AND s.id IS NOT NULL';
    } else if (status === 'pending') {
      query += ' AND s.id IS NULL AND a.dueDate >= NOW()';
    } else if (status === 'overdue') {
      query += ' AND s.id IS NULL AND a.dueDate < NOW()';
    }

    query += ' ORDER BY a.dueDate ASC';

    const [assignments] = await pool.execute(query, queryParams);

    res.json(assignments);

  } catch (error) {
    console.error('Get student assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch student assignments' });
  }
});

// Submit assignment
router.post('/assignments/submit', [
  body('assignmentId').isInt(),
  body('content').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assignmentId, content, attachments } = req.body;
    const studentId = req.user.userId; // Assuming user ID is in JWT

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
      [assignmentId]
    );

    if (assignments.length === 0) {
      return res.status(400).json({ error: 'Assignment not found or past due' });
    }

    // Check if already submitted
    const [existingSubmissions] = await pool.execute(
      'SELECT id FROM submissions WHERE assignmentId = ? AND studentId = ?',
      [assignmentId, studentRecordId]
    );

    if (existingSubmissions.length > 0) {
      return res.status(400).json({ error: 'Assignment already submitted' });
    }

    // Insert submission
    await pool.execute(
      'INSERT INTO submissions (assignmentId, studentId, content, attachments, submittedAt, status) VALUES (?, ?, ?, ?, NOW(), "submitted")',
      [assignmentId, studentRecordId, content, JSON.stringify(attachments || [])]
    );

    res.json({ message: 'Assignment submitted successfully' });

  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

// Get student grades
router.get('/grades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, semester } = req.query;

    let query = `
      SELECT g.*, a.title as assignmentTitle, a.type as assignmentType,
             c.name as courseName, c.code as courseCode, c.credits,
             s.submittedAt, s.content as submissionContent
      FROM grades g
      JOIN assignments a ON g.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      JOIN enrollments e ON c.id = e.courseId
      JOIN students st ON e.studentId = st.id
      LEFT JOIN submissions s ON g.assignmentId = s.assignmentId AND g.studentId = s.studentId
      WHERE st.userId = ?
    `;

    const queryParams = [id];

    if (courseId) {
      query += ' AND c.id = ?';
      queryParams.push(courseId);
    }

    if (semester) {
      query += ' AND c.semester = ?';
      queryParams.push(semester);
    }

    query += ' ORDER BY g.createdAt DESC';

    const [grades] = await pool.execute(query, queryParams);

    // Calculate GPA
    const [gpaData] = await pool.execute(`
      SELECT 
        AVG(g.grade) as averageGrade,
        SUM(c.credits) as totalCredits,
        SUM(CASE WHEN g.grade >= 70 THEN c.credits ELSE 0 END) as earnedCredits
      FROM grades g
      JOIN assignments a ON g.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      JOIN enrollments e ON c.id = e.courseId
      JOIN students st ON e.studentId = st.id
      WHERE st.userId = ?
    `, [id]);

    res.json({
      grades,
      gpa: gpaData[0] || { averageGrade: 0, totalCredits: 0, earnedCredits: 0 }
    });

  } catch (error) {
    console.error('Get student grades error:', error);
    res.status(500).json({ error: 'Failed to fetch student grades' });
  }
});

// Get student attendance
router.get('/attendance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, month, year } = req.query;

    let query = `
      SELECT a.*, c.name as courseName, c.code as courseCode,
             l.firstName as lecturerFirstName, l.lastName as lecturerLastName
      FROM attendance a
      JOIN courses c ON a.courseId = c.id
      JOIN enrollments e ON c.id = e.courseId
      JOIN students st ON e.studentId = st.id
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      WHERE st.userId = ?
    `;

    const queryParams = [id];

    if (courseId) {
      query += ' AND c.id = ?';
      queryParams.push(courseId);
    }

    if (month) {
      query += ' AND MONTH(a.date) = ?';
      queryParams.push(month);
    }

    if (year) {
      query += ' AND YEAR(a.date) = ?';
      queryParams.push(year);
    }

    query += ' ORDER BY a.date DESC';

    const [attendance] = await pool.execute(query, queryParams);

    res.json(attendance);

  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch student attendance' });
  }
});

// Get student fees
router.get('/fees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, year } = req.query;

    let query = `
      SELECT f.*, p.name as programName
      FROM fees f
      JOIN students s ON f.studentId = s.id
      LEFT JOIN programs p ON s.programId = p.id
      WHERE s.userId = ?
    `;

    const queryParams = [id];

    if (status) {
      query += ' AND f.status = ?';
      queryParams.push(status);
    }

    if (year) {
      query += ' AND YEAR(f.dueDate) = ?';
      queryParams.push(year);
    }

    query += ' ORDER BY f.dueDate DESC';

    const [fees] = await pool.execute(query, queryParams);

    // Get payment history
    const [payments] = await pool.execute(`
      SELECT p.*, f.description as feeDescription
      FROM payments p
      JOIN fees f ON p.feeId = f.id
      JOIN students s ON f.studentId = s.id
      WHERE s.userId = ?
      ORDER BY p.paymentDate DESC
    `, [id]);

    res.json({
      fees,
      payments
    });

  } catch (error) {
    console.error('Get student fees error:', error);
    res.status(500).json({ error: 'Failed to fetch student fees' });
  }
});

// Get student profile
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [profiles] = await pool.execute(`
      SELECT s.*, u.firstName, u.lastName, u.email, u.phone, u.address, u.dateOfBirth,
             p.name as programName, p.duration as programDuration,
             f.name as facultyName, f.dean as facultyDean
      FROM students s
      JOIN users u ON s.userId = u.id
      LEFT JOIN programs p ON s.programId = p.id
      LEFT JOIN faculties f ON p.facultyId = f.id
      WHERE s.userId = ?
    `, [id]);

    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    res.json(profiles[0]);

  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ error: 'Failed to fetch student profile' });
  }
});

// Update student profile
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
    const { firstName, lastName, phone, address, dateOfBirth, emergencyContact } = req.body;

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

    // Update student-specific info
    if (emergencyContact) {
      await pool.execute(
        'UPDATE students SET emergencyContact = ?, updatedAt = NOW() WHERE userId = ?',
        [JSON.stringify(emergencyContact), id]
      );
    }

    res.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
