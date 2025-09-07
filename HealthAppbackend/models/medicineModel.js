// medicineModel.js - ENHANCED VERSION
const pool = require("../config/db");

const Medicine = {
async create(doctor_id, patient_id, chronic_disease_id, medicineData) {
    const {
      medicine_name, form, strength, dosage, frequency, duration, instructions, prescribed_date
    } = medicineData;

    const result = await pool.query(
      `INSERT INTO medicines
        (doctor_id, patient_id, chronic_disease_id, medicine_name, form, strength, 
         dosage, frequency, duration, instructions, date_prescribed, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [doctor_id, patient_id, chronic_disease_id, medicine_name, form, strength,
       dosage, frequency, duration, instructions, prescribed_date || new Date(), 'prescribed']
    );
    return result.rows[0];
  },

  async findById(medicine_id) {
    const result = await pool.query(
      `SELECT m.*, d.name as doctor_name, p.name as patient_name
       FROM medicines m
       LEFT JOIN doctors d ON m.doctor_id = d.doctor_id
       LEFT JOIN patients p ON m.patient_id = p.patient_id
       WHERE m.medicine_id = $1`,
      [medicine_id]
    );
    return result.rows[0];
  },

 async findByPatient(patient_id) {
    const result = await pool.query(
      `SELECT m.*, d.name as doctor_name, p.name as patient_name
       FROM medicines m
       LEFT JOIN doctors d ON m.doctor_id = d.doctor_id
       LEFT JOIN patients p ON m.patient_id = p.patient_id
       WHERE m.patient_id = $1
       ORDER BY m.date_prescribed DESC`,
      [patient_id]
    );
    return result.rows;
  },

  async findByDoctor(doctor_id) {
    const result = await pool.query(
      `SELECT m.*, p.name as patient_name, p.phone as patient_phone
       FROM medicines m
       LEFT JOIN patients p ON m.patient_id = p.patient_id
       WHERE m.doctor_id = $1
       ORDER BY m.date_prescribed DESC`,
      [doctor_id]
    );
    return result.rows;
  },

  async updateStatus(medicine_id, status) {
    const result = await pool.query(
      `UPDATE medicines
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE medicine_id = $2
       RETURNING *`,
      [status, medicine_id]
    );
    return result.rows[0];
  },

  // New method to get patient medicines with doctor verification
  async findByPatientAndDoctor(patient_id, doctor_id) {
    const result = await pool.query(
      `SELECT m.*, d.name as doctor_name, p.name as patient_name
       FROM medicines m
       LEFT JOIN doctors d ON m.doctor_id = d.doctor_id
       LEFT JOIN patients p ON m.patient_id = p.patient_id
       WHERE m.patient_id = $1 AND m.doctor_id = $2
       ORDER BY m.date_prescribed DESC`,
      [patient_id, doctor_id]
    );
    return result.rows;
  }
};

module.exports = Medicine;