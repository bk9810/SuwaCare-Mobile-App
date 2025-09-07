// routes/chronicConditions.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Add new chronic condition
router.post('/', async (req, res) => {
  try {
    const { name_en, description_en, severity_level } = req.body;
    const result = await db.query(
      `INSERT INTO chronic_conditions (name, description, severity_level) 
       VALUES ($1,$2,$3) RETURNING *`,
      [name_en, description_en, severity_level || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all conditions
router.get('/', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM chronic_conditions ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
