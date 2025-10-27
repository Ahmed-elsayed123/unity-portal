const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get all chatbot Q&A
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM chatbot_qa
      WHERE 1=1
    `;
    
    const queryParams = [];

    if (category) {
      query += ' AND category = ?';
      queryParams.push(category);
    }

    if (search) {
      query += ' AND (question LIKE ? OR answer LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [qa] = await pool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM chatbot_qa
      WHERE 1=1
    `;
    const countParams = [];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (question LIKE ? OR answer LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      qa,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get chatbot Q&A error:', error);
    res.status(500).json({ error: 'Failed to fetch chatbot Q&A' });
  }
});

// Get Q&A by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [qa] = await pool.execute(
      'SELECT * FROM chatbot_qa WHERE id = ?',
      [id]
    );

    if (qa.length === 0) {
      return res.status(404).json({ error: 'Q&A not found' });
    }

    res.json(qa[0]);

  } catch (error) {
    console.error('Get Q&A error:', error);
    res.status(500).json({ error: 'Failed to fetch Q&A' });
  }
});

// Create Q&A
router.post('/', [
  body('question').notEmpty().trim(),
  body('answer').notEmpty().trim(),
  body('category').isIn(['general', 'academic', 'financial', 'technical', 'admission', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { question, answer, category, keywords, tags } = req.body;

    // Check if question already exists
    const [existingQa] = await pool.execute(
      'SELECT id FROM chatbot_qa WHERE question = ?',
      [question]
    );

    if (existingQa.length > 0) {
      return res.status(400).json({ error: 'Question already exists' });
    }

    // Insert Q&A
    const [result] = await pool.execute(
      'INSERT INTO chatbot_qa (question, answer, category, keywords, tags, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [question, answer, category, JSON.stringify(keywords || []), JSON.stringify(tags || [])]
    );

    res.status(201).json({
      message: 'Q&A created successfully',
      qaId: result.insertId
    });

  } catch (error) {
    console.error('Create Q&A error:', error);
    res.status(500).json({ error: 'Failed to create Q&A' });
  }
});

// Update Q&A
router.put('/:id', [
  body('question').optional().notEmpty().trim(),
  body('answer').optional().notEmpty().trim(),
  body('category').optional().isIn(['general', 'academic', 'financial', 'technical', 'admission', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { question, answer, category, keywords, tags } = req.body;

    // Check if Q&A exists
    const [qa] = await pool.execute(
      'SELECT id FROM chatbot_qa WHERE id = ?',
      [id]
    );

    if (qa.length === 0) {
      return res.status(404).json({ error: 'Q&A not found' });
    }

    // Check if question already exists (excluding current Q&A)
    if (question) {
      const [existingQa] = await pool.execute(
        'SELECT id FROM chatbot_qa WHERE question = ? AND id != ?',
        [question, id]
      );

      if (existingQa.length > 0) {
        return res.status(400).json({ error: 'Question already exists' });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (question) {
      updateFields.push('question = ?');
      updateValues.push(question);
    }
    if (answer) {
      updateFields.push('answer = ?');
      updateValues.push(answer);
    }
    if (category) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (keywords) {
      updateFields.push('keywords = ?');
      updateValues.push(JSON.stringify(keywords));
    }
    if (tags) {
      updateFields.push('tags = ?');
      updateValues.push(JSON.stringify(tags));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(id);

    await pool.execute(
      `UPDATE chatbot_qa SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Q&A updated successfully' });

  } catch (error) {
    console.error('Update Q&A error:', error);
    res.status(500).json({ error: 'Failed to update Q&A' });
  }
});

// Delete Q&A
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if Q&A exists
    const [qa] = await pool.execute(
      'SELECT id FROM chatbot_qa WHERE id = ?',
      [id]
    );

    if (qa.length === 0) {
      return res.status(404).json({ error: 'Q&A not found' });
    }

    // Delete Q&A
    await pool.execute('DELETE FROM chatbot_qa WHERE id = ?', [id]);

    res.json({ message: 'Q&A deleted successfully' });

  } catch (error) {
    console.error('Delete Q&A error:', error);
    res.status(500).json({ error: 'Failed to delete Q&A' });
  }
});

// Search Q&A for chatbot
router.post('/search', [
  body('query').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { query, category, limit = 5 } = req.body;

    let searchQuery = `
      SELECT *, 
        MATCH(question, answer, keywords) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance_score
      FROM chatbot_qa
      WHERE MATCH(question, answer, keywords) AGAINST(? IN NATURAL LANGUAGE MODE)
    `;

    const queryParams = [query, query];

    if (category) {
      searchQuery += ' AND category = ?';
      queryParams.push(category);
    }

    searchQuery += ' ORDER BY relevance_score DESC LIMIT ?';
    queryParams.push(parseInt(limit));

    const [results] = await pool.execute(searchQuery, queryParams);

    // If no results from full-text search, try simple LIKE search
    if (results.length === 0) {
      let likeQuery = `
        SELECT *, 
          CASE 
            WHEN question LIKE ? THEN 3
            WHEN answer LIKE ? THEN 2
            WHEN keywords LIKE ? THEN 1
            ELSE 0
          END as relevance_score
        FROM chatbot_qa
        WHERE question LIKE ? OR answer LIKE ? OR keywords LIKE ?
      `;

      const likeParams = [];
      const searchTerm = `%${query}%`;

      for (let i = 0; i < 6; i++) {
        likeParams.push(searchTerm);
      }

      if (category) {
        likeQuery += ' AND category = ?';
        likeParams.push(category);
      }

      likeQuery += ' ORDER BY relevance_score DESC LIMIT ?';
      likeParams.push(parseInt(limit));

      const [likeResults] = await pool.execute(likeQuery, likeParams);
      res.json(likeResults);
    } else {
      res.json(results);
    }

  } catch (error) {
    console.error('Search Q&A error:', error);
    res.status(500).json({ error: 'Failed to search Q&A' });
  }
});

// Get Q&A by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;

    const [qa] = await pool.execute(
      'SELECT * FROM chatbot_qa WHERE category = ? ORDER BY createdAt DESC LIMIT ?',
      [category, parseInt(limit)]
    );

    res.json(qa);

  } catch (error) {
    console.error('Get Q&A by category error:', error);
    res.status(500).json({ error: 'Failed to fetch Q&A by category' });
  }
});

// Get chatbot statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalQa,
        COUNT(CASE WHEN category = 'general' THEN 1 END) as generalQa,
        COUNT(CASE WHEN category = 'academic' THEN 1 END) as academicQa,
        COUNT(CASE WHEN category = 'financial' THEN 1 END) as financialQa,
        COUNT(CASE WHEN category = 'technical' THEN 1 END) as technicalQa,
        COUNT(CASE WHEN category = 'admission' THEN 1 END) as admissionQa,
        COUNT(CASE WHEN category = 'other' THEN 1 END) as otherQa
      FROM chatbot_qa
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get chatbot stats error:', error);
    res.status(500).json({ error: 'Failed to fetch chatbot statistics' });
  }
});

// Bulk import Q&A
router.post('/bulk-import', [
  body('qa').isArray(),
  body('qa.*.question').notEmpty().trim(),
  body('qa.*.answer').notEmpty().trim(),
  body('qa.*.category').isIn(['general', 'academic', 'financial', 'technical', 'admission', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { qa } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const qaData of qa) {
        try {
          // Check if question already exists
          const [existingQa] = await connection.execute(
            'SELECT id FROM chatbot_qa WHERE question = ?',
            [qaData.question]
          );

          if (existingQa.length > 0) {
            errors.push(`Question "${qaData.question}" already exists`);
            errorCount++;
            continue;
          }

          // Insert Q&A
          await connection.execute(
            'INSERT INTO chatbot_qa (question, answer, category, keywords, tags, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
            [qaData.question, qaData.answer, qaData.category, JSON.stringify(qaData.keywords || []), JSON.stringify(qaData.tags || [])]
          );

          successCount++;

        } catch (error) {
          errors.push(`Error processing Q&A "${qaData.question}": ${error.message}`);
          errorCount++;
        }
      }

      await connection.commit();

      res.json({
        message: 'Bulk Q&A import completed',
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
    console.error('Bulk Q&A import error:', error);
    res.status(500).json({ error: 'Failed to import Q&A' });
  }
});

module.exports = router;
