const pool = require("../config/db");

async function assignDoctorToPatient(doctor_id, patient_id) {
  const result = await pool.query(
    `INSERT INTO doctor_patient (doctor_id, patient_id)
     VALUES ($1, $2)
     ON CONFLICT (doctor_id, patient_id) DO NOTHING
     RETURNING *`,
    [doctor_id, patient_id]
  );
  return result.rows[0];
}

async function getPatientsForDoctor(doctor_id) {
  const result = await pool.query(
    `SELECT p.* FROM patients p
     JOIN doctor_patient dp ON p.patient_id = dp.patient_id
     WHERE dp.doctor_id = $1`,
    [doctor_id]
  );
  return result.rows;
}

async function getDoctorsForPatient(patient_id) {
  const result = await pool.query(
    `SELECT d.* FROM doctors d
     JOIN doctor_patient dp ON d.doctor_id = dp.doctor_id
     WHERE dp.patient_id = $1`,
    [patient_id]
  );
  return result.rows;
}

module.exports = { assignDoctorToPatient, getPatientsForDoctor, getDoctorsForPatient };
