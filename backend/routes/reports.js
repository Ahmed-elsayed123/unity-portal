const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all reports
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, dateFrom, dateTo } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, u.firstName, u.lastName, u.email
      FROM reports r
      JOIN users u ON r.generatedBy = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (type) {
      query += ' AND r.type = ?';
      queryParams.push(type);
    }

    if (status) {
      query += ' AND r.status = ?';
      queryParams.push(status);
    }

    if (dateFrom) {
      query += ' AND DATE(r.generatedAt) >= ?';
      queryParams.push(dateFrom);
    }

    if (dateTo) {
      query += ' AND DATE(r.generatedAt) <= ?';
      queryParams.push(dateTo);
    }

    query += ' ORDER BY r.generatedAt DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [reports] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM reports r
      WHERE 1=1
    `;
    const countParams = [];

    if (type) {
      countQuery += ' AND r.type = ?';
      countParams.push(type);
    }

    if (status) {
      countQuery += ' AND r.status = ?';
      countParams.push(status);
    }

    if (dateFrom) {
      countQuery += ' AND DATE(r.generatedAt) >= ?';
      countParams.push(dateFrom);
    }

    if (dateTo) {
      countQuery += ' AND DATE(r.generatedAt) <= ?';
      countParams.push(dateTo);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Generate student report
router.post('/students', [
  body('reportType').isIn(['enrollment', 'grades', 'attendance', 'fees', 'comprehensive']),
  body('filters').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reportType, filters, format = 'json' } = req.body;
    const generatedBy = req.user.userId;

    let reportData = {};
    let reportTitle = '';

    switch (reportType) {
      case 'enrollment':
        reportData = await generateEnrollmentReport(filters);
        reportTitle = 'Student Enrollment Report';
        break;
      case 'grades':
        reportData = await generateGradesReport(filters);
        reportTitle = 'Student Grades Report';
        break;
      case 'attendance':
        reportData = await generateAttendanceReport(filters);
        reportTitle = 'Student Attendance Report';
        break;
      case 'fees':
        reportData = await generateFeesReport(filters);
        reportTitle = 'Student Fees Report';
        break;
      case 'comprehensive':
        reportData = await generateComprehensiveReport(filters);
        reportTitle = 'Comprehensive Student Report';
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    // Save report record
    const [result] = await pool.execute(
      'INSERT INTO reports (type, title, data, filters, generatedBy, generatedAt, status) VALUES (?, ?, ?, ?, ?, NOW(), "completed")',
      [reportType, reportTitle, JSON.stringify(reportData), JSON.stringify(filters), generatedBy]
    );

    res.json({
      message: 'Report generated successfully',
      reportId: result.insertId,
      data: reportData
    });

  } catch (error) {
    console.error('Generate student report error:', error);
    res.status(500).json({ error: 'Failed to generate student report' });
  }
});

// Generate academic report
router.post('/academic', [
  body('reportType').isIn(['courses', 'programs', 'faculties', 'performance']),
  body('filters').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reportType, filters, format = 'json' } = req.body;
    const generatedBy = req.user.userId;

    let reportData = {};
    let reportTitle = '';

    switch (reportType) {
      case 'courses':
        reportData = await generateCoursesReport(filters);
        reportTitle = 'Courses Report';
        break;
      case 'programs':
        reportData = await generateProgramsReport(filters);
        reportTitle = 'Programs Report';
        break;
      case 'faculties':
        reportData = await generateFacultiesReport(filters);
        reportTitle = 'Faculties Report';
        break;
      case 'performance':
        reportData = await generatePerformanceReport(filters);
        reportTitle = 'Academic Performance Report';
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    // Save report record
    const [result] = await pool.execute(
      'INSERT INTO reports (type, title, data, filters, generatedBy, generatedAt, status) VALUES (?, ?, ?, ?, ?, NOW(), "completed")',
      [reportType, reportTitle, JSON.stringify(reportData), JSON.stringify(filters), generatedBy]
    );

    res.json({
      message: 'Report generated successfully',
      reportId: result.insertId,
      data: reportData
    });

  } catch (error) {
    console.error('Generate academic report error:', error);
    res.status(500).json({ error: 'Failed to generate academic report' });
  }
});

// Generate financial report
router.post('/financial', [
  body('reportType').isIn(['fees', 'payments', 'revenue', 'outstanding']),
  body('filters').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reportType, filters, format = 'json' } = req.body;
    const generatedBy = req.user.userId;

    let reportData = {};
    let reportTitle = '';

    switch (reportType) {
      case 'fees':
        reportData = await generateFeesReport(filters);
        reportTitle = 'Fees Report';
        break;
      case 'payments':
        reportData = await generatePaymentsReport(filters);
        reportTitle = 'Payments Report';
        break;
      case 'revenue':
        reportData = await generateRevenueReport(filters);
        reportTitle = 'Revenue Report';
        break;
      case 'outstanding':
        reportData = await generateOutstandingReport(filters);
        reportTitle = 'Outstanding Fees Report';
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    // Save report record
    const [result] = await pool.execute(
      'INSERT INTO reports (type, title, data, filters, generatedBy, generatedAt, status) VALUES (?, ?, ?, ?, ?, NOW(), "completed")',
      [reportType, reportTitle, JSON.stringify(reportData), JSON.stringify(filters), generatedBy]
    );

    res.json({
      message: 'Report generated successfully',
      reportId: result.insertId,
      data: reportData
    });

  } catch (error) {
    console.error('Generate financial report error:', error);
    res.status(500).json({ error: 'Failed to generate financial report' });
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [reports] = await pool.execute(`
      SELECT r.*, u.firstName, u.lastName, u.email
      FROM reports r
      JOIN users u ON r.generatedBy = u.id
      WHERE r.id = ?
    `, [id]);

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(reports[0]);

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Delete report
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if report exists
    const [reports] = await pool.execute(
      'SELECT id FROM reports WHERE id = ?',
      [id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Delete report
    await pool.execute('DELETE FROM reports WHERE id = ?', [id]);

    res.json({ message: 'Report deleted successfully' });

  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// Helper functions for report generation
async function generateEnrollmentReport(filters) {
  const { programId, facultyId, year, semester } = filters;
  
  let query = `
    SELECT s.*, u.firstName, u.lastName, u.email,
           p.name as programName, f.name as facultyName,
           COUNT(e.courseId) as enrolledCourses
    FROM students s
    JOIN users u ON s.userId = u.id
    LEFT JOIN programs p ON s.programId = p.id
    LEFT JOIN faculties f ON p.facultyId = f.id
    LEFT JOIN enrollments e ON s.id = e.studentId
    WHERE 1=1
  `;
  
  const queryParams = [];

  if (programId) {
    query += ' AND s.programId = ?';
    queryParams.push(programId);
  }

  if (facultyId) {
    query += ' AND p.facultyId = ?';
    queryParams.push(facultyId);
  }

  if (year) {
    query += ' AND YEAR(s.enrollmentDate) = ?';
    queryParams.push(year);
  }

  query += ' GROUP BY s.id ORDER BY u.lastName, u.firstName';

  const [students] = await pool.execute(query, queryParams);

  return {
    summary: {
      totalStudents: students.length,
      totalPrograms: new Set(students.map(s => s.programId)).size,
      totalFaculties: new Set(students.map(s => s.facultyId)).size
    },
    students
  };
}

async function generateGradesReport(filters) {
  const { studentId, courseId, programId, semester, year, minGrade, maxGrade } = filters;
  
  let query = `
    SELECT g.*, a.title as assignmentTitle, a.maxPoints,
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

  if (programId) {
    query += ' AND st.programId = ?';
    queryParams.push(programId);
  }

  if (semester) {
    query += ' AND c.semester = ?';
    queryParams.push(semester);
  }

  if (year) {
    query += ' AND c.year = ?';
    queryParams.push(year);
  }

  if (minGrade) {
    query += ' AND g.grade >= ?';
    queryParams.push(minGrade);
  }

  if (maxGrade) {
    query += ' AND g.grade <= ?';
    queryParams.push(maxGrade);
  }

  query += ' ORDER BY g.createdAt DESC';

  const [grades] = await pool.execute(query, queryParams);

  // Calculate statistics
  const totalGrades = grades.length;
  const averageGrade = totalGrades > 0 ? grades.reduce((sum, g) => sum + g.grade, 0) / totalGrades : 0;
  const passRate = totalGrades > 0 ? (grades.filter(g => g.grade >= 70).length / totalGrades) * 100 : 0;

  return {
    summary: {
      totalGrades,
      averageGrade: Math.round(averageGrade * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
      minGrade: totalGrades > 0 ? Math.min(...grades.map(g => g.grade)) : 0,
      maxGrade: totalGrades > 0 ? Math.max(...grades.map(g => g.grade)) : 0
    },
    grades
  };
}

async function generateAttendanceReport(filters) {
  const { studentId, courseId, programId, month, year, status } = filters;
  
  let query = `
    SELECT a.*, c.name as courseName, c.code as courseCode,
           u.firstName, u.lastName, u.email, st.studentId as studentNumber
    FROM attendance a
    JOIN courses c ON a.courseId = c.id
    JOIN students st ON a.studentId = st.id
    JOIN users u ON st.userId = u.id
    WHERE 1=1
  `;
  
  const queryParams = [];

  if (studentId) {
    query += ' AND a.studentId = ?';
    queryParams.push(studentId);
  }

  if (courseId) {
    query += ' AND a.courseId = ?';
    queryParams.push(courseId);
  }

  if (programId) {
    query += ' AND st.programId = ?';
    queryParams.push(programId);
  }

  if (month) {
    query += ' AND MONTH(a.date) = ?';
    queryParams.push(month);
  }

  if (year) {
    query += ' AND YEAR(a.date) = ?';
    queryParams.push(year);
  }

  if (status) {
    query += ' AND a.status = ?';
    queryParams.push(status);
  }

  query += ' ORDER BY a.date DESC';

  const [attendance] = await pool.execute(query, queryParams);

  // Calculate statistics
  const totalRecords = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;
  const excusedCount = attendance.filter(a => a.status === 'excused').length;
  const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

  return {
    summary: {
      totalRecords,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    },
    attendance
  };
}

async function generateFeesReport(filters) {
  const { studentId, programId, status, year, semester, type } = filters;
  
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

  if (programId) {
    query += ' AND s.programId = ?';
    queryParams.push(programId);
  }

  if (status) {
    query += ' AND f.status = ?';
    queryParams.push(status);
  }

  if (year) {
    query += ' AND f.year = ?';
    queryParams.push(year);
  }

  if (semester) {
    query += ' AND f.semester = ?';
    queryParams.push(semester);
  }

  if (type) {
    query += ' AND f.type = ?';
    queryParams.push(type);
  }

  query += ' ORDER BY f.dueDate DESC';

  const [fees] = await pool.execute(query, queryParams);

  // Calculate statistics
  const totalFees = fees.length;
  const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const pendingAmount = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const overdueAmount = fees.filter(f => f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0);

  return {
    summary: {
      totalFees,
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      collectionRate: totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0
    },
    fees
  };
}

async function generateComprehensiveReport(filters) {
  const enrollmentData = await generateEnrollmentReport(filters);
  const gradesData = await generateGradesReport(filters);
  const attendanceData = await generateAttendanceReport(filters);
  const feesData = await generateFeesReport(filters);

  return {
    enrollment: enrollmentData,
    grades: gradesData,
    attendance: attendanceData,
    fees: feesData,
    generatedAt: new Date().toISOString()
  };
}

async function generateCoursesReport(filters) {
  const { facultyId, programId, semester, year, lecturerId } = filters;
  
  let query = `
    SELECT c.*, l.firstName as lecturerFirstName, l.lastName as lecturerLastName,
           p.name as programName, f.name as facultyName,
           COUNT(e.studentId) as enrolledStudents
    FROM courses c
    LEFT JOIN lecturers l ON c.lecturerId = l.id
    LEFT JOIN users u ON l.userId = u.id
    LEFT JOIN programs p ON c.programId = p.id
    LEFT JOIN faculties f ON p.facultyId = f.id
    LEFT JOIN enrollments e ON c.id = e.courseId
    WHERE 1=1
  `;
  
  const queryParams = [];

  if (facultyId) {
    query += ' AND f.id = ?';
    queryParams.push(facultyId);
  }

  if (programId) {
    query += ' AND c.programId = ?';
    queryParams.push(programId);
  }

  if (semester) {
    query += ' AND c.semester = ?';
    queryParams.push(semester);
  }

  if (year) {
    query += ' AND c.year = ?';
    queryParams.push(year);
  }

  if (lecturerId) {
    query += ' AND c.lecturerId = ?';
    queryParams.push(lecturerId);
  }

  query += ' GROUP BY c.id ORDER BY c.name ASC';

  const [courses] = await pool.execute(query, queryParams);

  return {
    summary: {
      totalCourses: courses.length,
      totalStudents: courses.reduce((sum, c) => sum + c.enrolledStudents, 0),
      averageEnrollment: courses.length > 0 ? courses.reduce((sum, c) => sum + c.enrolledStudents, 0) / courses.length : 0
    },
    courses
  };
}

async function generateProgramsReport(filters) {
  const { facultyId, degreeType } = filters;
  
  let query = `
    SELECT p.*, f.name as facultyName,
           COUNT(s.id) as totalStudents,
           COUNT(c.id) as totalCourses
    FROM programs p
    JOIN faculties f ON p.facultyId = f.id
    LEFT JOIN students s ON p.id = s.programId
    LEFT JOIN courses c ON p.id = c.programId
    WHERE 1=1
  `;
  
  const queryParams = [];

  if (facultyId) {
    query += ' AND p.facultyId = ?';
    queryParams.push(facultyId);
  }

  if (degreeType) {
    query += ' AND p.degreeType = ?';
    queryParams.push(degreeType);
  }

  query += ' GROUP BY p.id ORDER BY p.name ASC';

  const [programs] = await pool.execute(query, queryParams);

  return {
    summary: {
      totalPrograms: programs.length,
      totalStudents: programs.reduce((sum, p) => sum + p.totalStudents, 0),
      totalCourses: programs.reduce((sum, p) => sum + p.totalCourses, 0)
    },
    programs
  };
}

async function generateFacultiesReport(filters) {
  const query = `
    SELECT f.*,
           COUNT(p.id) as totalPrograms,
           COUNT(s.id) as totalStudents,
           COUNT(l.id) as totalLecturers
    FROM faculties f
    LEFT JOIN programs p ON f.id = p.facultyId
    LEFT JOIN students s ON p.id = s.programId
    LEFT JOIN lecturers l ON f.id = l.departmentId
    GROUP BY f.id
    ORDER BY f.name ASC
  `;

  const [faculties] = await pool.execute(query);

  return {
    summary: {
      totalFaculties: faculties.length,
      totalPrograms: faculties.reduce((sum, f) => sum + f.totalPrograms, 0),
      totalStudents: faculties.reduce((sum, f) => sum + f.totalStudents, 0),
      totalLecturers: faculties.reduce((sum, f) => sum + f.totalLecturers, 0)
    },
    faculties
  };
}

async function generatePerformanceReport(filters) {
  const { programId, facultyId, semester, year } = filters;
  
  let query = `
    SELECT s.*, u.firstName, u.lastName, u.email,
           p.name as programName, f.name as facultyName,
           AVG(g.grade) as averageGrade,
           COUNT(g.id) as totalGrades,
           COUNT(CASE WHEN g.grade >= 70 THEN 1 END) as passedGrades
    FROM students s
    JOIN users u ON s.userId = u.id
    LEFT JOIN programs p ON s.programId = p.id
    LEFT JOIN faculties f ON p.facultyId = f.id
    LEFT JOIN grades g ON s.id = g.studentId
    WHERE 1=1
  `;
  
  const queryParams = [];

  if (programId) {
    query += ' AND s.programId = ?';
    queryParams.push(programId);
  }

  if (facultyId) {
    query += ' AND p.facultyId = ?';
    queryParams.push(facultyId);
  }

  query += ' GROUP BY s.id ORDER BY averageGrade DESC';

  const [students] = await pool.execute(query, queryParams);

  // Calculate overall statistics
  const totalStudents = students.length;
  const averageGrade = totalStudents > 0 ? students.reduce((sum, s) => sum + (s.averageGrade || 0), 0) / totalStudents : 0;
  const passRate = totalStudents > 0 ? (students.filter(s => s.averageGrade >= 70).length / totalStudents) * 100 : 0;

  return {
    summary: {
      totalStudents,
      averageGrade: Math.round(averageGrade * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
      topPerformers: students.slice(0, 10),
      bottomPerformers: students.slice(-10).reverse()
    },
    students
  };
}

async function generatePaymentsReport(filters) {
  const { studentId, paymentMethod, dateFrom, dateTo } = filters;
  
  let query = `
    SELECT p.*, f.description as feeDescription,
           s.studentId as studentNumber,
           u.firstName, u.lastName, u.email
    FROM payments p
    JOIN fees f ON p.feeId = f.id
    JOIN students s ON f.studentId = s.id
    JOIN users u ON s.userId = u.id
    WHERE 1=1
  `;
  
  const queryParams = [];

  if (studentId) {
    query += ' AND s.id = ?';
    queryParams.push(studentId);
  }

  if (paymentMethod) {
    query += ' AND p.paymentMethod = ?';
    queryParams.push(paymentMethod);
  }

  if (dateFrom) {
    query += ' AND DATE(p.paymentDate) >= ?';
    queryParams.push(dateFrom);
  }

  if (dateTo) {
    query += ' AND DATE(p.paymentDate) <= ?';
    queryParams.push(dateTo);
  }

  query += ' ORDER BY p.paymentDate DESC';

  const [payments] = await pool.execute(query, queryParams);

  // Calculate statistics
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

  return {
    summary: {
      totalPayments,
      totalAmount,
      averagePayment: Math.round(averagePayment * 100) / 100
    },
    payments
  };
}

async function generateRevenueReport(filters) {
  const { year, month, paymentMethod } = filters;
  
  let query = `
    SELECT 
      DATE(p.paymentDate) as paymentDate,
      SUM(p.amount) as dailyRevenue,
      COUNT(p.id) as paymentCount
    FROM payments p
    WHERE 1=1
  `;
  
  const queryParams = [];

  if (year) {
    query += ' AND YEAR(p.paymentDate) = ?';
    queryParams.push(year);
  }

  if (month) {
    query += ' AND MONTH(p.paymentDate) = ?';
    queryParams.push(month);
  }

  if (paymentMethod) {
    query += ' AND p.paymentMethod = ?';
    queryParams.push(paymentMethod);
  }

  query += ' GROUP BY DATE(p.paymentDate) ORDER BY paymentDate DESC';

  const [revenue] = await pool.execute(query, queryParams);

  // Calculate total statistics
  const totalRevenue = revenue.reduce((sum, r) => sum + r.dailyRevenue, 0);
  const totalPayments = revenue.reduce((sum, r) => sum + r.paymentCount, 0);
  const averageDailyRevenue = revenue.length > 0 ? totalRevenue / revenue.length : 0;

  return {
    summary: {
      totalRevenue,
      totalPayments,
      averageDailyRevenue: Math.round(averageDailyRevenue * 100) / 100,
      period: revenue.length > 0 ? `${revenue[revenue.length - 1].paymentDate} to ${revenue[0].paymentDate}` : 'No data'
    },
    revenue
  };
}

async function generateOutstandingReport(filters) {
  const { programId, facultyId, daysOverdue } = filters;
  
  let query = `
    SELECT f.*, s.studentId as studentNumber,
           u.firstName, u.lastName, u.email,
           p.name as programName,
           DATEDIFF(NOW(), f.dueDate) as daysOverdue
    FROM fees f
    JOIN students s ON f.studentId = s.id
    JOIN users u ON s.userId = u.id
    LEFT JOIN programs p ON s.programId = p.id
    WHERE f.status IN ('pending', 'overdue')
  `;
  
  const queryParams = [];

  if (programId) {
    query += ' AND s.programId = ?';
    queryParams.push(programId);
  }

  if (facultyId) {
    query += ' AND p.facultyId = ?';
    queryParams.push(facultyId);
  }

  if (daysOverdue) {
    query += ' AND DATEDIFF(NOW(), f.dueDate) >= ?';
    queryParams.push(daysOverdue);
  }

  query += ' ORDER BY daysOverdue DESC';

  const [outstanding] = await pool.execute(query, queryParams);

  // Calculate statistics
  const totalOutstanding = outstanding.length;
  const totalAmount = outstanding.reduce((sum, f) => sum + f.amount, 0);
  const averageAmount = totalOutstanding > 0 ? totalAmount / totalOutstanding : 0;

  return {
    summary: {
      totalOutstanding,
      totalAmount,
      averageAmount: Math.round(averageAmount * 100) / 100
    },
    outstanding
  };
}

module.exports = router;
