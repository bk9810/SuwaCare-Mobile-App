const pool = require('../config/db');

const Caregiver = {
  async create(patient_id, { name, email, phone, relation }) {
    const result = await pool.query(
      `INSERT INTO caregivers (patient_id, name, email, phone, relation)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patient_id, name, email, phone, relation]
    );
    return result.rows[0];
  },

  async findByPatient(patient_id) {
    const result = await pool.query(
      `SELECT * FROM caregivers WHERE patient_id = $1`,
      [patient_id]
    );
    return result.rows;
  },

  async update(caregiver_id, { name, email, phone, relation }) {
    const result = await pool.query(
      `UPDATE caregivers
       SET name = $1, email = $2, phone = $3, relation = $4
       WHERE caregiver_id = $5 RETURNING *`,
      [name, email, phone, relation, caregiver_id]
    );
    return result.rows[0];
  }
};

module.exports = Caregiver;
