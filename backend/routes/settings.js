const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../config/database');

// Get system settings
router.get('/', async (req, res) => {
  try {
    const [settings] = await pool.execute(`
      SELECT * FROM settings 
      ORDER BY category, settingKey
    `);

    // Group settings by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = {};
      }
      acc[setting.category][setting.settingKey] = {
        value: setting.value,
        description: setting.description,
        type: setting.type,
        options: setting.options ? JSON.parse(setting.options) : null
      };
      return acc;
    }, {});

    res.json(groupedSettings);

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get settings by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;

    const [settings] = await pool.execute(
      'SELECT * FROM settings WHERE category = ? ORDER BY settingKey',
      [category]
    );

    const categorySettings = settings.reduce((acc, setting) => {
      acc[setting.settingKey] = {
        value: setting.value,
        description: setting.description,
        type: setting.type,
        options: setting.options ? JSON.parse(setting.options) : null
      };
      return acc;
    }, {});

    res.json(categorySettings);

  } catch (error) {
    console.error('Get settings by category error:', error);
    res.status(500).json({ error: 'Failed to fetch settings by category' });
  }
});

// Update settings
router.put('/', [
  body('settings').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { settings } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      let updatedCount = 0;

      for (const [category, categorySettings] of Object.entries(settings)) {
        for (const [settingKey, settingData] of Object.entries(categorySettings)) {
          // Validate setting value based on type
          if (settingData.type === 'boolean') {
            settingData.value = settingData.value ? 'true' : 'false';
          } else if (settingData.type === 'number') {
            settingData.value = settingData.value.toString();
          } else if (settingData.type === 'json') {
            settingData.value = JSON.stringify(settingData.value);
          }

          // Update setting
          const [result] = await connection.execute(
            'UPDATE settings SET value = ?, updatedAt = NOW() WHERE category = ? AND settingKey = ?',
            [settingData.value, category, settingKey]
          );

          if (result.affectedRows > 0) {
            updatedCount++;
          }
        }
      }

      await connection.commit();

      res.json({
        message: 'Settings updated successfully',
        updatedCount
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Update single setting
router.put('/:category/:key', [
  body('value').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, key } = req.params;
    const { value } = req.body;

    // Check if setting exists
    const [settings] = await pool.execute(
      'SELECT type FROM settings WHERE category = ? AND settingKey = ?',
      [category, key]
    );

    if (settings.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    let settingValue = value;

    // Validate and format value based on type
    if (settings[0].type === 'boolean') {
      settingValue = value ? 'true' : 'false';
    } else if (settings[0].type === 'number') {
      settingValue = value.toString();
    } else if (settings[0].type === 'json') {
      settingValue = JSON.stringify(value);
    }

    // Update setting
    await pool.execute(
      'UPDATE settings SET value = ?, updatedAt = NOW() WHERE category = ? AND settingKey = ?',
      [settingValue, category, key]
    );

    res.json({ message: 'Setting updated successfully' });

  } catch (error) {
    console.error('Update single setting error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Create new setting
router.post('/', [
  body('category').notEmpty().trim(),
  body('settingKey').notEmpty().trim(),
  body('value').notEmpty(),
  body('description').notEmpty().trim(),
  body('type').isIn(['string', 'number', 'boolean', 'json', 'select'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, settingKey, value, description, type, options } = req.body;

    // Check if setting already exists
    const [existingSettings] = await pool.execute(
      'SELECT id FROM settings WHERE category = ? AND settingKey = ?',
      [category, settingKey]
    );

    if (existingSettings.length > 0) {
      return res.status(400).json({ error: 'Setting already exists' });
    }

    let settingValue = value;

    // Format value based on type
    if (type === 'boolean') {
      settingValue = value ? 'true' : 'false';
    } else if (type === 'number') {
      settingValue = value.toString();
    } else if (type === 'json') {
      settingValue = JSON.stringify(value);
    }

    // Insert setting
    const [result] = await pool.execute(
      'INSERT INTO settings (category, settingKey, value, description, type, options, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [category, settingKey, settingValue, description, type, JSON.stringify(options || [])]
    );

    res.status(201).json({
      message: 'Setting created successfully',
      settingId: result.insertId
    });

  } catch (error) {
    console.error('Create setting error:', error);
    res.status(500).json({ error: 'Failed to create setting' });
  }
});

// Delete setting
router.delete('/:category/:key', async (req, res) => {
  try {
    const { category, key } = req.params;

    // Check if setting exists
    const [settings] = await pool.execute(
      'SELECT id FROM settings WHERE category = ? AND settingKey = ?',
      [category, key]
    );

    if (settings.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    // Delete setting
    await pool.execute(
      'DELETE FROM settings WHERE category = ? AND settingKey = ?',
      [category, key]
    );

    res.json({ message: 'Setting deleted successfully' });

  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
});

// Reset settings to default
router.post('/reset', async (req, res) => {
  try {
    const { category } = req.body;

    let query = 'UPDATE settings SET value = defaultValue, updatedAt = NOW()';
    const queryParams = [];

    if (category) {
      query += ' WHERE category = ?';
      queryParams.push(category);
    }

    const [result] = await pool.execute(query, queryParams);

    res.json({
      message: 'Settings reset to default successfully',
      resetCount: result.affectedRows
    });

  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
});

// Export settings
router.get('/export', async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const [settings] = await pool.execute(`
      SELECT category, settingKey, value, description, type, options, defaultValue
      FROM settings 
      ORDER BY category, settingKey
    `);

    if (format === 'csv') {
      // Convert to CSV format
      const csv = [
        'Category,Setting Key,Value,Description,Type,Options,Default Value',
        ...settings.map(s => 
          `"${s.category}","${s.settingKey}","${s.value}","${s.description}","${s.type}","${s.options || ''}","${s.defaultValue || ''}"`
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=settings.csv');
      res.send(csv);
    } else {
      res.json(settings);
    }

  } catch (error) {
    console.error('Export settings error:', error);
    res.status(500).json({ error: 'Failed to export settings' });
  }
});

// Import settings
router.post('/import', [
  body('settings').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { settings, overwrite = false } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      let importedCount = 0;
      let skippedCount = 0;
      const errors = [];

      for (const setting of settings) {
        try {
          // Check if setting already exists
          const [existingSettings] = await connection.execute(
            'SELECT id FROM settings WHERE category = ? AND settingKey = ?',
            [setting.category, setting.settingKey]
          );

          if (existingSettings.length > 0 && !overwrite) {
            skippedCount++;
            continue;
          }

          let settingValue = setting.value;

          // Format value based on type
          if (setting.type === 'boolean') {
            settingValue = setting.value ? 'true' : 'false';
          } else if (setting.type === 'number') {
            settingValue = setting.value.toString();
          } else if (setting.type === 'json') {
            settingValue = JSON.stringify(setting.value);
          }

          if (existingSettings.length > 0) {
            // Update existing setting
            await connection.execute(
              'UPDATE settings SET value = ?, description = ?, type = ?, options = ?, defaultValue = ?, updatedAt = NOW() WHERE category = ? AND settingKey = ?',
              [settingValue, setting.description, setting.type, JSON.stringify(setting.options || []), setting.defaultValue || settingValue, setting.category, setting.settingKey]
            );
          } else {
            // Insert new setting
            await connection.execute(
              'INSERT INTO settings (category, settingKey, value, description, type, options, defaultValue, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
              [setting.category, setting.settingKey, settingValue, setting.description, setting.type, JSON.stringify(setting.options || []), setting.defaultValue || settingValue]
            );
          }

          importedCount++;

        } catch (error) {
          errors.push(`Error processing setting ${setting.category}.${setting.settingKey}: ${error.message}`);
        }
      }

      await connection.commit();

      res.json({
        message: 'Settings import completed',
        importedCount,
        skippedCount,
        errors: errors.slice(0, 10) // Limit error messages
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Import settings error:', error);
    res.status(500).json({ error: 'Failed to import settings' });
  }
});

// Get system information
router.get('/system/info', async (req, res) => {
  try {
    const [systemInfo] = await pool.execute(`
      SELECT 
        VERSION() as databaseVersion,
        NOW() as currentTime,
        @@max_connections as maxConnections,
        @@max_connect_errors as maxConnectErrors,
        @@table_open_cache as tableOpenCache,
        @@thread_cache_size as threadCacheSize
    `);

    const [tableStats] = await pool.execute(`
      SELECT 
        table_name,
        table_rows,
        data_length,
        index_length,
        (data_length + index_length) as total_size
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
      ORDER BY total_size DESC
    `);

    res.json({
      system: systemInfo[0],
      tables: tableStats
    });

  } catch (error) {
    console.error('Get system info error:', error);
    res.status(500).json({ error: 'Failed to fetch system information' });
  }
});

module.exports = router;
