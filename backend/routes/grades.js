const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all grades
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, studentId, courseId, assignmentId, minGrade, maxGrade } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT g.*, a.title as assignmentTitle, a.maxPoints, a.type as assignmentType,
             c.name as courseName, c.code as courseCode,
             u.firstName, u.lastName, u.email, st.studentId as studentNumber
      FROM grades g
      JOIN assignments a ON g.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      JOIN students st ON g.studentId = st.id
      JOIN users u ON st.userId = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (studentId) {
      query += ' AND g.studentId = ?';
      queryParams.push(studentId);
    }

    if (courseId) {
      query += ' AND c.id = ?';
      queryParams.push(courseId);
    }

    if (assignmentId) {
      query += ' AND g.assignmentId = ?';
      queryParams.push(assignmentId);
    }

    if (minGrade) {
      query += ' AND g.grade >= ?';
      queryParams.push(minGrade);
    }

    if (maxGrade) {
      query += ' AND g.grade <= ?';
      queryParams.push(maxGrade);
    }

    query += ' ORDER BY g.createdAt DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [grades] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM grades g
      JOIN assignments a ON g.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      WHERE 1=1
    `;
    const countParams = [];

    if (studentId) {
      countQuery += ' AND g.studentId = ?';
      countParams.push(studentId);
    }

    if (courseId) {
      countQuery += ' AND c.id = ?';
      countParams.push(courseId);
    }

    if (assignmentId) {
      countQuery += ' AND g.assignmentId = ?';
      countParams.push(assignmentId);
    }

    if (minGrade) {
      countQuery += ' AND g.grade >= ?';
      countParams.push(minGrade);
    }

    if (maxGrade) {
      countQuery += ' AND g.grade <= ?';
      countParams.push(maxGrade);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      grades,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Get grade by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [grades] = await pool.execute(`
      SELECT g.*, a.title as assignmentTitle, a.maxPoints, a.type as assignmentType,
             c.name as courseName, c.code as courseCode,
             u.firstName, u.lastName, u.email, st.studentId as studentNumber,
             s.content as submissionContent, s.submittedAt
      FROM grades g
      JOIN assignments a ON g.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      JOIN students st ON g.studentId = st.id
      JOIN users u ON st.userId = u.id
      LEFT JOIN submissions s ON g.assignmentId = s.assignmentId AND g.studentId = s.studentId
      WHERE g.id = ?
    `, [id]);

    if (grades.length === 0) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    res.json(grades[0]);

  } catch (error) {
    console.error('Get grade error:', error);
    res.status(500).json({ error: 'Failed to fetch grade' });
  }
});

// Create grade
router.post('/', [
  body('assignmentId').isInt(),
  body('studentId').isInt(),
  body('grade').isFloat({ min: 0 }),
  body('feedback').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { assignmentId, studentId, grade, feedback } = req.body;

    // Check if assignment exists
    const [assignments] = await pool.execute(
      'SELECT maxPoints FROM assignments WHERE id = ?',
      [assignmentId]
    );

    if (assignments.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (grade > assignments[0].maxPoints) {
      return res.status(400).json({ error: 'Grade cannot exceed maximum points' });
    }

    // Check if student exists
    const [students] = await pool.execute(
      'SELECT id FROM students WHERE id = ?',
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Insert or update grade
    const [result] = await pool.execute(`
      INSERT INTO grades (assignmentId, studentId, grade, feedback, createdAt)
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE grade = VALUES(grade), feedback = VALUES(feedback), updatedAt = NOW()
    `, [assignmentId, studentId, grade, feedback]);

    res.status(201).json({
      message: 'Grade recorded successfully',
      gradeId: result.insertId
    });

  } catch (error) {
    console.error('Create grade error:', error);
    res.status(500).json({ error: 'Failed to record grade' });
  }
});

// Update grade
router.put('/:id', [
  body('grade').isFloat({ min: 0 }),
  body('feedback').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { grade, feedback } = req.body;

    // Check if grade exists
    const [grades] = await pool.execute(
      'SELECT a.maxPoints FROM grades g JOIN assignments a ON g.assignmentId = a.id WHERE g.id = ?',
      [id]
    );

    if (grades.length === 0) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    if (grade > grades[0].maxPoints) {
      return res.status(400).json({ error: 'Grade cannot exceed maximum points' });
    }

    // Update grade
    await pool.execute(
      'UPDATE grades SET grade = ?, feedback = ?, updatedAt = NOW() WHERE id = ?',
      [grade, feedback, id]
    );

    res.json({ message: 'Grade updated successfully' });

  } catch (error) {
    console.error('Update grade error:', error);
    res.status(500).json({ error: 'Failed to update grade' });
  }
});

// Delete grade
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if grade exists
    const [grades] = await pool.execute(
      'SELECT id FROM grades WHERE id = ?',
      [id]
    );

    if (grades.length === 0) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    // Delete grade
    await pool.execute('DELETE FROM grades WHERE id = ?', [id]);

    res.json({ message: 'Grade deleted successfully' });

  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({ error: 'Failed to delete grade' });
  }
});

// Get student transcript
router.get('/transcript/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester, year } = req.query;

    let query = `
      SELECT g.*, a.title as assignmentTitle, a.type as assignmentType,
             c.name as courseName, c.code as courseCode, c.credits,
             u.firstName, u.lastName, u.email
      FROM grades g
      JOIN assignments a ON g.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      JOIN students st ON g.studentId = st.id
      JOIN users u ON st.userId = u.id
      WHERE st.id = ?
    `;

    const queryParams = [studentId];

    if (semester) {
      query += ' AND c.semester = ?';
      queryParams.push(semester);
    }

    if (year) {
      query += ' AND c.year = ?';
      queryParams.push(year);
    }

    query += ' ORDER BY c.year DESC, c.semester DESC, c.name ASC';

    const [grades] = await pool.execute(query, queryParams);

    // Calculate GPA
    const [gpaData] = await pool.execute(`
      SELECT 
        AVG(g.grade) as averageGrade,
        SUM(c.credits) as totalCredits,
        SUM(CASE WHEN g.grade >= 70 THEN c.credits ELSE 0 END) as earnedCredits,
        COUNT(DISTINCT c.id) as totalCourses
      FROM grades g
      JOIN assignments a ON g.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      JOIN students st ON g.studentId = st.id
      WHERE st.id = ?
    `, [studentId]);

    // Get course-wise summary
    const [courseSummary] = await pool.execute(`
      SELECT c.id, c.name as courseName, c.code as courseCode, c.credits,
             AVG(g.grade) as averageGrade,
             COUNT(g.id) as totalAssignments,
             MAX(g.createdAt) as lastGradeDate
      FROM grades g
      JOIN assignments a ON g.assignmentId = a.id
      JOIN courses c ON a.courseId = c.id
      JOIN students st ON g.studentId = st.id
      WHERE st.id = ?
      GROUP BY c.id
      ORDER BY c.year DESC, c.semester DESC, c.name ASC
    `, [studentId]);

    res.json({
      grades,
      gpa: gpaData[0] || { averageGrade: 0, totalCredits: 0, earnedCredits: 0, totalCourses: 0 },
      courseSummary
    });

  } catch (error) {
    console.error('Get transcript error:', error);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
});

// Get grade statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalGrades,
        AVG(grade) as averageGrade,
        MIN(grade) as minimumGrade,
        MAX(grade) as maximumGrade,
        COUNT(CASE WHEN grade >= 90 THEN 1 END) as aGrades,
        COUNT(CASE WHEN grade >= 80 AND grade < 90 THEN 1 END) as bGrades,
        COUNT(CASE WHEN grade >= 70 AND grade < 80 THEN 1 END) as cGrades,
        COUNT(CASE WHEN grade >= 60 AND grade < 70 THEN 1 END) as dGrades,
        COUNT(CASE WHEN grade < 60 THEN 1 END) as fGrades
      FROM grades
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get grade stats error:', error);
    res.status(500).json({ error: 'Failed to fetch grade statistics' });
  }
});

// Bulk grade import
router.post('/bulk-import', [
  body('grades').isArray(),
  body('grades.*.assignmentId').isInt(),
  body('grades.*.studentId').isInt(),
  body('grades.*.grade').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { grades } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const gradeData of grades) {
        try {
          // Validate assignment exists
          const [assignments] = await connection.execute(
            'SELECT maxPoints FROM assignments WHERE id = ?',
            [gradeData.assignmentId]
          );

          if (assignments.length === 0) {
            errors.push(`Assignment ${gradeData.assignmentId} not found`);
            errorCount++;
            continue;
          }

          if (gradeData.grade > assignments[0].maxPoints) {
            errors.push(`Grade ${gradeData.grade} exceeds maximum points for assignment ${gradeData.assignmentId}`);
            errorCount++;
            continue;
          }

          // Validate student exists
          const [students] = await connection.execute(
            'SELECT id FROM students WHERE id = ?',
            [gradeData.studentId]
          );

          if (students.length === 0) {
            errors.push(`Student ${gradeData.studentId} not found`);
            errorCount++;
            continue;
          }

          // Insert or update grade
          await connection.execute(`
            INSERT INTO grades (assignmentId, studentId, grade, feedback, createdAt)
            VALUES (?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE grade = VALUES(grade), feedback = VALUES(feedback), updatedAt = NOW()
          `, [gradeData.assignmentId, gradeData.studentId, gradeData.grade, gradeData.feedback || '']);

          successCount++;

        } catch (error) {
          errors.push(`Error processing grade for student ${gradeData.studentId}, assignment ${gradeData.assignmentId}: ${error.message}`);
          errorCount++;
        }
      }

      await connection.commit();

      res.json({
        message: 'Bulk grade import completed',
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
    console.error('Bulk grade import error:', error);
    res.status(500).json({ error: 'Failed to import grades' });
  }
});

module.exports = router;
