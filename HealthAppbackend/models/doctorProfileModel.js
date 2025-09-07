const pool = require("../config/db");

// Get doctor profile by doctor_id
async function getDoctorProfile(doctor_id) {
    const result = await pool.query(
        "SELECT * FROM doctor_profiles WHERE doctor_id = $1",
        [doctor_id]
    );
    return result.rows[0];
}

// Create or update profile
async function upsertDoctorProfile(doctor_id, { bio, sub_specialization, experience_years, qualifications, languages_spoken }) {
    const result = await pool.query(
        `INSERT INTO doctor_profiles 
         (doctor_id, bio, sub_specialization, experience_years, qualifications, languages_spoken)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (doctor_id) 
         DO UPDATE SET bio=$2, sub_specialization=$3, experience_years=$4, qualifications=$5, languages_spoken=$6, updated_at=NOW()
         RETURNING *`,
        [doctor_id, bio, sub_specialization, experience_years, qualifications, JSON.stringify(languages_spoken)]
    );
    return result.rows[0];
}

module.exports = { getDoctorProfile, upsertDoctorProfile };
