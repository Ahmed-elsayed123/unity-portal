const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, courseId, studentId, date, status, month, year } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, c.name as courseName, c.code as courseCode,
             u.firstName, u.lastName, u.email, st.studentId as studentNumber,
             l.firstName as lecturerFirstName, l.lastName as lecturerLastName
      FROM attendance a
      JOIN courses c ON a.courseId = c.id
      JOIN students st ON a.studentId = st.id
      JOIN users u ON st.userId = u.id
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN users lu ON l.userId = lu.id
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (courseId) {
      query += ' AND a.courseId = ?';
      queryParams.push(courseId);
    }

    if (studentId) {
      query += ' AND a.studentId = ?';
      queryParams.push(studentId);
    }

    if (date) {
      query += ' AND DATE(a.date) = ?';
      queryParams.push(date);
    }

    if (status) {
      query += ' AND a.status = ?';
      queryParams.push(status);
    }

    if (month) {
      query += ' AND MONTH(a.date) = ?';
      queryParams.push(month);
    }

    if (year) {
      query += ' AND YEAR(a.date) = ?';
      queryParams.push(year);
    }

    query += ' ORDER BY a.date DESC, c.name ASC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [attendance] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM attendance a
      WHERE 1=1
    `;
    const countParams = [];

    if (courseId) {
      countQuery += ' AND a.courseId = ?';
      countParams.push(courseId);
    }

    if (studentId) {
      countQuery += ' AND a.studentId = ?';
      countParams.push(studentId);
    }

    if (date) {
      countQuery += ' AND DATE(a.date) = ?';
      countParams.push(date);
    }

    if (status) {
      countQuery += ' AND a.status = ?';
      countParams.push(status);
    }

    if (month) {
      countQuery += ' AND MONTH(a.date) = ?';
      countParams.push(month);
    }

    if (year) {
      countQuery += ' AND YEAR(a.date) = ?';
      countParams.push(year);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      attendance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Get attendance by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [attendance] = await pool.execute(`
      SELECT a.*, c.name as courseName, c.code as courseCode,
             u.firstName, u.lastName, u.email, st.studentId as studentNumber,
             l.firstName as lecturerFirstName, l.lastName as lecturerLastName
      FROM attendance a
      JOIN courses c ON a.courseId = c.id
      JOIN students st ON a.studentId = st.id
      JOIN users u ON st.userId = u.id
      LEFT JOIN lecturers l ON c.lecturerId = l.id
      LEFT JOIN users lu ON l.userId = lu.id
      WHERE a.id = ?
    `, [id]);

    if (attendance.length === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json(attendance[0]);

  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance record' });
  }
});

// Mark attendance
router.post('/', [
  body('courseId').isInt(),
  body('date').isISO8601(),
  body('attendance').isArray(),
  body('attendance.*.studentId').isInt(),
  body('attendance.*.status').isIn(['present', 'absent', 'late', 'excused'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, date, attendance } = req.body;

    // Check if course exists
    const [courses] = await pool.execute(
      'SELECT id FROM courses WHERE id = ?',
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const record of attendance) {
        try {
          // Check if student is enrolled in the course
          const [enrollments] = await connection.execute(
            'SELECT id FROM enrollments WHERE courseId = ? AND studentId = ?',
            [courseId, record.studentId]
          );

          if (enrollments.length === 0) {
            errors.push(`Student ${record.studentId} is not enrolled in course ${courseId}`);
            errorCount++;
            continue;
          }

          // Insert or update attendance record
          await connection.execute(
            'INSERT INTO attendance (courseId, studentId, date, status, createdAt) VALUES (?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE status = VALUES(status), updatedAt = NOW()',
            [courseId, record.studentId, date, record.status]
          );

          successCount++;

        } catch (error) {
          errors.push(`Error processing attendance for student ${record.studentId}: ${error.message}`);
          errorCount++;
        }
      }

      await connection.commit();

      res.json({
        message: 'Attendance marked successfully',
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
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Update attendance
router.put('/:id', [
  body('status').isIn(['present', 'absent', 'late', 'excused'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    // Check if attendance record exists
    const [attendance] = await pool.execute(
      'SELECT id FROM attendance WHERE id = ?',
      [id]
    );

    if (attendance.length === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // Update attendance
    await pool.execute(
      'UPDATE attendance SET status = ?, notes = ?, updatedAt = NOW() WHERE id = ?',
      [status, notes, id]
    );

    res.json({ message: 'Attendance updated successfully' });

  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

// Delete attendance
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if attendance record exists
    const [attendance] = await pool.execute(
      'SELECT id FROM attendance WHERE id = ?',
      [id]
    );

    if (attendance.length === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    // Delete attendance record
    await pool.execute('DELETE FROM attendance WHERE id = ?', [id]);

    res.json({ message: 'Attendance record deleted successfully' });

  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

// Get attendance summary for student
router.get('/summary/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId, month, year } = req.query;

    let query = `
      SELECT 
        COUNT(*) as totalClasses,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as presentClasses,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absentClasses,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as lateClasses,
        SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excusedClasses,
        ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendancePercentage
      FROM attendance a
      WHERE a.studentId = ?
    `;

    const queryParams = [studentId];

    if (courseId) {
      query += ' AND a.courseId = ?';
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

    const [summary] = await pool.execute(query, queryParams);

    res.json(summary[0] || {
      totalClasses: 0,
      presentClasses: 0,
      absentClasses: 0,
      lateClasses: 0,
      excusedClasses: 0,
      attendancePercentage: 0
    });

  } catch (error) {
    console.error('Get attendance summary error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance summary' });
  }
});

// Get attendance summary for course
router.get('/summary/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date, month, year } = req.query;

    let query = `
      SELECT 
        COUNT(*) as totalRecords,
        COUNT(DISTINCT studentId) as totalStudents,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as presentCount,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absentCount,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as lateCount,
        SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excusedCount,
        ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendancePercentage
      FROM attendance a
      WHERE a.courseId = ?
    `;

    const queryParams = [courseId];

    if (date) {
      query += ' AND DATE(a.date) = ?';
      queryParams.push(date);
    }

    if (month) {
      query += ' AND MONTH(a.date) = ?';
      queryParams.push(month);
    }

    if (year) {
      query += ' AND YEAR(a.date) = ?';
      queryParams.push(year);
    }

    const [summary] = await pool.execute(query, queryParams);

    res.json(summary[0] || {
      totalRecords: 0,
      totalStudents: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      excusedCount: 0,
      attendancePercentage: 0
    });

  } catch (error) {
    console.error('Get course attendance summary error:', error);
    res.status(500).json({ error: 'Failed to fetch course attendance summary' });
  }
});

// Get attendance statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalAttendanceRecords,
        COUNT(DISTINCT studentId) as totalStudents,
        COUNT(DISTINCT courseId) as totalCourses,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as totalPresent,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as totalAbsent,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as totalLate,
        SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as totalExcused,
        ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as overallAttendancePercentage
      FROM attendance
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance statistics' });
  }
});

module.exports = router;
