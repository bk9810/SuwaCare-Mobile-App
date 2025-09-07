//ChronicDiseaseModel
const pool = require('../config/db');

const ChronicDisease = {
  async create(patient_id, { disease_name, description, diagnosed_date }) {
    const result = await pool.query(
      `INSERT INTO chronic_diseases (patient_id, disease_name, description, diagnosed_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [patient_id, disease_name, description, diagnosed_date]
    );
    return result.rows[0];
  },

  async findByPatient(patient_id) {
    const result = await pool.query(
      `SELECT * FROM chronic_diseases WHERE patient_id = $1 ORDER BY created_at DESC`,
      [patient_id]
    );
    return result.rows;
  },

  async update(id, { disease_name, description, diagnosed_date }) {
    const result = await pool.query(
      `UPDATE chronic_diseases
       SET disease_name = $1, description = $2, diagnosed_date = $3
       WHERE id = $4 RETURNING *`,
      [disease_name, description, diagnosed_date, id]
    );
    return result.rows[0];
  }
};

module.exports = ChronicDisease;
