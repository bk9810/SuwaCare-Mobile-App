const pool = require("../config/db");
async function addDoctor({ name, email, password, phone, specialization }) {
  const result = await pool.query(
    `INSERT INTO doctors (name, email, password, phone, specialization, status) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, email, password, phone, specialization, "PENDING"]
  );
  return result.rows[0];
}
async function getAllDoctors() {
  const result = await pool.query("SELECT * FROM doctors ORDER BY doctor_id DESC");
  return result.rows;
}
async function updateDoctorStatus(id, status) {
  const result = await pool.query(
    "UPDATE doctors SET status = $1 WHERE doctor_id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
}
async function doctorLogin(email) {
  const result = await pool.query("SELECT * FROM doctors WHERE email=$1", [email]);
  return result.rows[0];
}
async function getDoctorById(id) {
  try {
    const doctorId = parseInt(id);
    if (isNaN(doctorId)) {
      throw new Error('Invalid doctor ID');
    }
    const result = await pool.query("SELECT * FROM doctors WHERE doctor_id = $1", [doctorId]);
    return result.rows[0];
  } catch (error) {
    console.error('Database error in getDoctorById:', error);
    throw error;
  }
}
async function getDoctorsBySpecialization(specialization) {
  const result = await pool.query(
    "SELECT * FROM doctors WHERE specialization = $1",
    [specialization]
  );
  return result.rows;
}
async function updateDoctorProfile(id, { name, phone, specialization }) {
  try {
    const doctorId = parseInt(id);
    if (isNaN(doctorId)) {
      throw new Error('Invalid doctor ID');
    }
    
    const result = await pool.query(
      `UPDATE doctors 
       SET name=$1, phone=$2, specialization=$3 
       WHERE doctor_id=$4 RETURNING *`,
      [name, phone, specialization, doctorId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error in updateDoctorProfile:', error);
    throw error;
  }
}

module.exports = {
  getAllDoctors,
  addDoctor,
  updateDoctorStatus,
  doctorLogin,
  getDoctorById,
  getDoctorsBySpecialization,
  updateDoctorProfile,
};