// routes/patients.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ Register Patient - This handles POST /api/patients
router.post('/', async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      phone_number, 
      nic, 
      date_of_birth, 
      gender, 
      address, 
      email, 
      password, 
      preferred_language 
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !phone_number || !nic || !date_of_birth || !gender || !email || !password) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const result = await db.query(
      `INSERT INTO patients 
       (first_name, last_name, phone_number, nic, date_of_birth, gender, address, email, password, preferred_language) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id, first_name, last_name, email, phone_number, created_at`,
      [first_name, last_name, phone_number, nic, date_of_birth, gender, address, email, hashedPassword, preferred_language || 'si']
    );

    console.log("✅ Patient saved to database:", result.rows[0]);

    res.status(201).json({
      message: "Patient registered successfully!",
      patient: result.rows[0]
    });

  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    
    // Handle specific database errors
    if (err.code === '23505') { // Unique constraint violation
      if (err.constraint === 'patients_email_key') {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (err.constraint === 'patients_nic_key') {
        return res.status(400).json({ error: "NIC already exists" });
      }
    }
    
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ✅ Get all patients
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, first_name, last_name, email, phone_number, created_at FROM patients ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching patients:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login Patient
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await db.query("SELECT * FROM patients WHERE email = $1", [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const patient = result.rows[0];
    const match = await bcrypt.compare(password, patient.password);
    
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = patient;

    res.json({ 
      message: "Login successful", 
      user: userWithoutPassword 
    });

  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

module.exports = router;