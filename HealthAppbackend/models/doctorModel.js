const pool = require("../config/db");

// Add doctor (when registering)
async function addDoctor({ name, email, password, phone, specialization }) {
  const result = await pool.query(
    `INSERT INTO doctors (name, email, password, phone, specialization, status) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, email, password, phone, specialization, "PENDING"]
  );
  return result.rows[0];
}

// Get all doctors - FIXED: Removed duplicate function
async function getAllDoctors() {
  const result = await pool.query("SELECT * FROM doctors ORDER BY doctor_id DESC");
  return result.rows;
}

// Update doctor status (admin approves/rejects)
async function updateDoctorStatus(id, status) {
  const result = await pool.query(
    "UPDATE doctors SET status = $1 WHERE doctor_id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
}

// Doctor login (fetch by email only)
async function doctorLogin(email) {
  const result = await pool.query("SELECT * FROM doctors WHERE email=$1", [email]);
  return result.rows[0];
}

// Get doctor by ID - FIXED: Added proper error handling
async function getDoctorById(id) {
  try {
    // Ensure ID is a valid number
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

// Get doctors by specialization
async function getDoctorsBySpecialization(specialization) {
  const result = await pool.query(
    "SELECT * FROM doctors WHERE specialization = $1",
    [specialization]
  );
  return result.rows;
}

// Update doctor profile - FIXED: Added proper error handling
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