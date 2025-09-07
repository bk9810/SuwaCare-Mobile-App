// models/appointmentModel.js
const pool = require('../config/db');

const Appointment = {
  async create({ patient_id, doctor_id, department, reason, scheduled_at }) {
    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, department, reason, scheduled_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patient_id, doctor_id, department, reason || null, scheduled_at || null]
    );
    return result.rows[0];
  },

  async findByPatient(patient_id) {
    const result = await pool.query(
      `SELECT a.*, d.name as doctor_name, d.specialization as doctor_specialization
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
       WHERE a.patient_id = $1
       ORDER BY a.created_at DESC`,
      [patient_id]
    );
    return result.rows;
  },

  async findByDoctor(doctor_id) {
    const result = await pool.query(
      `SELECT a.*, p.name as patient_name, p.email as patient_email
       FROM appointments a
       LEFT JOIN patients p ON a.patient_id = p.patient_id
       WHERE a.doctor_id = $1
       ORDER BY a.created_at DESC`,
      [doctor_id]
    );
    return result.rows;
  },

  async updateStatus(appointment_id, status) {
    const result = await pool.query(
      `UPDATE appointments SET status = $1 WHERE appointment_id = $2 RETURNING *`,
      [status, appointment_id]
    );
    return result.rows[0];
  },

  async getById(appointment_id) {
    const result = await pool.query(
      `SELECT * FROM appointments WHERE appointment_id = $1`,
      [appointment_id]
    );
    return result.rows[0];
  }
};

module.exports = Appointment;
