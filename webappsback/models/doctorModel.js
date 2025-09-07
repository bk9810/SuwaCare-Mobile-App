const pool = require("../config/db");

// ✅ Get all doctors - FIXED
async function getAllDoctors() {
  const result = await pool.query("SELECT * FROM doctors");
  return result.rows;
}

// ✅ Update doctor status
async function updateDoctorStatus(id, status) {
  const result = await pool.query(
    "UPDATE doctors SET status=$1 WHERE doctor_id=$2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
}

module.exports = {
  getAllDoctors,
  updateDoctorStatus,
};