const pool = require("../config/db");
async function createConsultantRequest({ patient_id, doctor_id, reason, preferred_datetime }) {
  const result = await pool.query(
    `INSERT INTO consultants (patient_id, doctor_id, reason, preferred_datetime, status) 
     VALUES ($1, $2, $3, $4, 'PENDING') RETURNING *`,
    [patient_id, doctor_id, reason, preferred_datetime]
  );
  return result.rows[0];
}

async function getConsultantsByDoctor(doctor_id) {
  const result = await pool.query(
    "SELECT * FROM consultants WHERE doctor_id = $1 ORDER BY created_at DESC",
    [doctor_id]
  );
  return result.rows;
}
async function getConsultantsByPatient(patient_id) {
  const result = await pool.query(
    "SELECT * FROM consultants WHERE patient_id = $1 ORDER BY created_at DESC",
    [patient_id]
  );
  return result.rows;
}
async function updateConsultantStatus(consultant_id, status, meeting_link = null) {
  const result = await pool.query(
    `UPDATE consultants SET status=$1, meeting_link=$2 
     WHERE consultant_id=$3 RETURNING *`,
    [status, meeting_link, consultant_id]
  );
  return result.rows[0];
}

module.exports = {
  createConsultantRequest,
  getConsultantsByDoctor,
  getConsultantsByPatient,
  updateConsultantStatus,
};
