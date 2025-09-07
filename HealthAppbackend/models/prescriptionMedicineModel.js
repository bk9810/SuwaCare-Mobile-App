// models/prescriptionMedicineModel.js
const pool = require('../config/db');

const PrescriptionMedicine = {
  async add({ prescription_id, name, dosage, frequency, duration, instructions }) {
    const result = await pool.query(
      `INSERT INTO prescription_medicines
       (prescription_id, name, dosage, frequency, duration, instructions)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [prescription_id, name, dosage || null, frequency || null, duration || null, instructions || null]
    );
    return result.rows[0];
  },

  async getByPrescription(prescription_id) {
    const result = await pool.query(
      `SELECT * FROM prescription_medicines
       WHERE prescription_id = $1
       ORDER BY medicine_id ASC`,
      [prescription_id]
    );
    return result.rows;
  },

  async updateById(medicine_id, updates) {
    const fields = [];
    const values = [];
    let idx = 1;
    
    const allowedFields = ['name', 'dosage', 'frequency', 'duration', 'instructions'];
    
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(updates[key]);
        idx++;
      }
    }
    
    if (!fields.length) return null;

    values.push(medicine_id);
    const query = `UPDATE prescription_medicines 
                   SET ${fields.join(', ')} 
                   WHERE medicine_id = $${idx} 
                   RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async deleteById(medicine_id) {
    const result = await pool.query(
      `DELETE FROM prescription_medicines WHERE medicine_id = $1 RETURNING *`,
      [medicine_id]
    );
    return result.rows[0];
  }
};

module.exports = PrescriptionMedicine;