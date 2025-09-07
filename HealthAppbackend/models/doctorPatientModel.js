// models/doctorPatientModel.js
const pool = require("../config/db");

const DoctorPatient = {
  async isAssigned(doctor_id, patient_id) {
    const result = await pool.query(
      `SELECT 1 FROM doctor_patients
       WHERE doctor_id = $1 AND patient_id = $2 AND status = 'active'`,
      [doctor_id, patient_id]
    );
    return result.rows.length > 0;
  },

  async findDoctorsByPatient(patient_id) {
    const result = await pool.query(
      `SELECT dp.*, d.name as doctor_name
       FROM doctor_patients dp
       JOIN doctors d ON dp.doctor_id = d.doctor_id
       WHERE dp.patient_id = $1 AND dp.status = 'active'`,
      [patient_id]
    );
    return result.rows;
  }
};

module.exports = DoctorPatient;
