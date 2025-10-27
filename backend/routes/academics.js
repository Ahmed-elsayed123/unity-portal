const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all faculties
router.get('/faculties', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT f.*, COUNT(p.id) as programCount
      FROM faculties f
      LEFT JOIN programs p ON f.id = p.facultyId
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (search) {
      query += ' AND (f.name LIKE ? OR f.description LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    query += ' GROUP BY f.id ORDER BY f.name ASC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [faculties] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM faculties f
      WHERE 1=1
    `;
    const countParams = [];

    if (search) {
      countQuery += ' AND (f.name LIKE ? OR f.description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      faculties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get faculties error:', error);
    res.status(500).json({ error: 'Failed to fetch faculties' });
  }
});

// Get faculty by ID
router.get('/faculties/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [faculties] = await pool.execute(
      'SELECT * FROM faculties WHERE id = ?',
      [id]
    );

    if (faculties.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Get programs in this faculty
    const [programs] = await pool.execute(
      'SELECT * FROM programs WHERE facultyId = ? ORDER BY name ASC',
      [id]
    );

    res.json({
      faculty: faculties[0],
      programs
    });

  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

// Create faculty
router.post('/faculties', [
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('dean').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, dean, contactEmail, contactPhone, location } = req.body;

    // Check if faculty already exists
    const [existingFaculties] = await pool.execute(
      'SELECT id FROM faculties WHERE name = ?',
      [name]
    );

    if (existingFaculties.length > 0) {
      return res.status(400).json({ error: 'Faculty already exists' });
    }

    // Insert faculty
    const [result] = await pool.execute(
      'INSERT INTO faculties (name, description, dean, contactEmail, contactPhone, location, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, description, dean, contactEmail, contactPhone, location]
    );

    res.status(201).json({
      message: 'Faculty created successfully',
      facultyId: result.insertId
    });

  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({ error: 'Failed to create faculty' });
  }
});

// Update faculty
router.put('/faculties/:id', [
  body('name').optional().notEmpty().trim(),
  body('description').optional().notEmpty().trim(),
  body('dean').optional().notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, dean, contactEmail, contactPhone, location } = req.body;

    // Check if faculty exists
    const [faculties] = await pool.execute(
      'SELECT id FROM faculties WHERE id = ?',
      [id]
    );

    if (faculties.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Check if faculty name already exists (excluding current faculty)
    if (name) {
      const [existingFaculties] = await pool.execute(
        'SELECT id FROM faculties WHERE name = ? AND id != ?',
        [name, id]
      );

      if (existingFaculties.length > 0) {
        return res.status(400).json({ error: 'Faculty name already exists' });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (dean) {
      updateFields.push('dean = ?');
      updateValues.push(dean);
    }
    if (contactEmail) {
      updateFields.push('contactEmail = ?');
      updateValues.push(contactEmail);
    }
    if (contactPhone) {
      updateFields.push('contactPhone = ?');
      updateValues.push(contactPhone);
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
      `UPDATE faculties SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Faculty updated successfully' });

  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ error: 'Failed to update faculty' });
  }
});

// Delete faculty
router.delete('/faculties/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if faculty exists
    const [faculties] = await pool.execute(
      'SELECT id FROM faculties WHERE id = ?',
      [id]
    );

    if (faculties.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Check if faculty has programs
    const [programs] = await pool.execute(
      'SELECT COUNT(*) as count FROM programs WHERE facultyId = ?',
      [id]
    );

    if (programs[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete faculty with programs' });
    }

    // Delete faculty
    await pool.execute('DELETE FROM faculties WHERE id = ?', [id]);

    res.json({ message: 'Faculty deleted successfully' });

  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({ error: 'Failed to delete faculty' });
  }
});

// Get all programs
router.get('/programs', async (req, res) => {
  try {
    const { page = 1, limit = 10, facultyId, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, f.name as facultyName,
             COUNT(c.id) as courseCount
      FROM programs p
      JOIN faculties f ON p.facultyId = f.id
      LEFT JOIN courses c ON p.id = c.programId
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (facultyId) {
      query += ' AND p.facultyId = ?';
      queryParams.push(facultyId);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    query += ' GROUP BY p.id ORDER BY p.name ASC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [programs] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM programs p
      WHERE 1=1
    `;
    const countParams = [];

    if (facultyId) {
      countQuery += ' AND p.facultyId = ?';
      countParams.push(facultyId);
    }

    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      programs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

// Get program by ID
router.get('/programs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [programs] = await pool.execute(`
      SELECT p.*, f.name as facultyName
      FROM programs p
      JOIN faculties f ON p.facultyId = f.id
      WHERE p.id = ?
    `, [id]);

    if (programs.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }

    // Get courses in this program
    const [courses] = await pool.execute(
      'SELECT * FROM courses WHERE programId = ? ORDER BY name ASC',
      [id]
    );

    res.json({
      program: programs[0],
      courses
    });

  } catch (error) {
    console.error('Get program error:', error);
    res.status(500).json({ error: 'Failed to fetch program' });
  }
});

// Create program
router.post('/programs', [
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('facultyId').isInt(),
  body('duration').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, facultyId, duration, degreeType, requirements, curriculum } = req.body;

    // Check if faculty exists
    const [faculties] = await pool.execute(
      'SELECT id FROM faculties WHERE id = ?',
      [facultyId]
    );

    if (faculties.length === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Check if program already exists
    const [existingPrograms] = await pool.execute(
      'SELECT id FROM programs WHERE name = ? AND facultyId = ?',
      [name, facultyId]
    );

    if (existingPrograms.length > 0) {
      return res.status(400).json({ error: 'Program already exists in this faculty' });
    }

    // Insert program
    const [result] = await pool.execute(
      'INSERT INTO programs (name, description, facultyId, duration, degreeType, requirements, curriculum, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [name, description, facultyId, duration, degreeType, JSON.stringify(requirements || []), JSON.stringify(curriculum || [])]
    );

    res.status(201).json({
      message: 'Program created successfully',
      programId: result.insertId
    });

  } catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({ error: 'Failed to create program' });
  }
});

// Update program
router.put('/programs/:id', [
  body('name').optional().notEmpty().trim(),
  body('description').optional().notEmpty().trim(),
  body('facultyId').optional().isInt(),
  body('duration').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, facultyId, duration, degreeType, requirements, curriculum } = req.body;

    // Check if program exists
    const [programs] = await pool.execute(
      'SELECT id FROM programs WHERE id = ?',
      [id]
    );

    if (programs.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }

    // Check if faculty exists (if facultyId is provided)
    if (facultyId) {
      const [faculties] = await pool.execute(
        'SELECT id FROM faculties WHERE id = ?',
        [facultyId]
      );

      if (faculties.length === 0) {
        return res.status(404).json({ error: 'Faculty not found' });
      }
    }

    // Check if program name already exists (excluding current program)
    if (name) {
      const [existingPrograms] = await pool.execute(
        'SELECT id FROM programs WHERE name = ? AND facultyId = ? AND id != ?',
        [name, facultyId || programs[0].facultyId, id]
      );

      if (existingPrograms.length > 0) {
        return res.status(400).json({ error: 'Program name already exists in this faculty' });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (facultyId) {
      updateFields.push('facultyId = ?');
      updateValues.push(facultyId);
    }
    if (duration) {
      updateFields.push('duration = ?');
      updateValues.push(duration);
    }
    if (degreeType) {
      updateFields.push('degreeType = ?');
      updateValues.push(degreeType);
    }
    if (requirements) {
      updateFields.push('requirements = ?');
      updateValues.push(JSON.stringify(requirements));
    }
    if (curriculum) {
      updateFields.push('curriculum = ?');
      updateValues.push(JSON.stringify(curriculum));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(id);

    await pool.execute(
      `UPDATE programs SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Program updated successfully' });

  } catch (error) {
    console.error('Update program error:', error);
    res.status(500).json({ error: 'Failed to update program' });
  }
});

// Delete program
router.delete('/programs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if program exists
    const [programs] = await pool.execute(
      'SELECT id FROM programs WHERE id = ?',
      [id]
    );

    if (programs.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }

    // Check if program has courses
    const [courses] = await pool.execute(
      'SELECT COUNT(*) as count FROM courses WHERE programId = ?',
      [id]
    );

    if (courses[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete program with courses' });
    }

    // Delete program
    await pool.execute('DELETE FROM programs WHERE id = ?', [id]);

    res.json({ message: 'Program deleted successfully' });

  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({ error: 'Failed to delete program' });
  }
});

// Get academic statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM faculties) as totalFaculties,
        (SELECT COUNT(*) FROM programs) as totalPrograms,
        (SELECT COUNT(*) FROM courses) as totalCourses,
        (SELECT COUNT(*) FROM students) as totalStudents,
        (SELECT COUNT(*) FROM lecturers) as totalLecturers,
        (SELECT AVG(duration) FROM programs) as averageProgramDuration
      FROM dual
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get academic stats error:', error);
    res.status(500).json({ error: 'Failed to fetch academic statistics' });
  }
});

module.exports = router;
