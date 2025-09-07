// models/patientModel.js
const pool = require('../config/db');

// Create a new patient
const createPatient = async ({ name, email, phone, password, address, dob }) => {
  const query = `
    INSERT INTO patients (name, email, phone, password, address, dob)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [name, email, phone, password, address, dob];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get patient by email
const getPatientByEmail = async (email) => {
  const query = 'SELECT * FROM patients WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// Get patient by ID
const getPatientById = async (id) => {
  const query = 'SELECT * FROM patients WHERE patient_id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Update patient by ID
const updatePatientById = async (id, { name, email, phone, address, dob }) => {
  const query = `
    UPDATE patients
    SET name = $1, email = $2, phone = $3, address = $4, dob = $5
    WHERE patient_id = $6
    RETURNING *;
  `;
  const values = [name, email, phone, address, dob, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};



module.exports = { createPatient, getPatientByEmail, getPatientById, updatePatientById };

