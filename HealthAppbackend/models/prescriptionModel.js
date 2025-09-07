// models/prescriptionModel.js
const pool = require('../config/db');

const Prescription = {
  async create({ appointment_id, doctor_id, patient_id, notes }) {
    const result = await pool.query(
      `INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [appointment_id, doctor_id, patient_id, notes || null]
    );
    return result.rows[0];
  },

  async getById(prescription_id) {
    const result = await pool.query(
      `SELECT p.*, 
              a.scheduled_at, 
              a.status AS appointment_status,
              d.name AS doctor_name,
              pt.name AS patient_name
       FROM prescriptions p
       LEFT JOIN appointments a ON p.appointment_id = a.appointment_id
       LEFT JOIN doctors d ON p.doctor_id = d.doctor_id
       LEFT JOIN patients pt ON p.patient_id = pt.patient_id
       WHERE p.prescription_id = $1`,
      [prescription_id]
    );
    return result.rows[0];
  },

  async getByPatient(patient_id) {
    const result = await pool.query(
      `SELECT p.*, 
              d.name AS doctor_name, 
              d.specialization,
              a.scheduled_at
       FROM prescriptions p
       LEFT JOIN doctors d ON p.doctor_id = d.doctor_id
       LEFT JOIN appointments a ON p.appointment_id = a.appointment_id
       WHERE p.patient_id = $1
       ORDER BY p.created_at DESC`,
      [patient_id]
    );
    return result.rows;
  },

  async getByDoctor(doctor_id) {
    const result = await pool.query(
      `SELECT p.*, 
              pt.name AS patient_name, 
              a.scheduled_at,
              a.status AS appointment_status
       FROM prescriptions p
       LEFT JOIN patients pt ON p.patient_id = pt.patient_id
       LEFT JOIN appointments a ON p.appointment_id = a.appointment_id
       WHERE p.doctor_id = $1
       ORDER BY p.created_at DESC`,
      [doctor_id]
    );
    return result.rows;
  }
};

module.exports = Prescription;
