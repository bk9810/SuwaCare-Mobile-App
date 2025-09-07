// testReportModel.js
const pool = require("../config/db");

async function addReport(patient_id, doctor_id, title, description, result, uploaded_by) {
  // Check if doctor is assigned to patient
  const check = await pool.query(
    "SELECT id FROM doctor_patient WHERE doctor_id = $1 AND patient_id = $2",
    [doctor_id, patient_id]
  );
  if (check.rows.length === 0) {
    throw new Error("Doctor is not assigned to this patient");
  }

  const doctor_patient_id = check.rows[0].id;

  const query = `
    INSERT INTO test_reports (patient_id, doctor_id, title, description, result, uploaded_by, doctor_patient_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [patient_id, doctor_id, title, description, result, uploaded_by, doctor_patient_id];
  const resultDb = await pool.query(query, values);
  
  // Create notification for lab
  await createLabNotification(resultDb.rows[0]);
  
  return resultDb.rows[0];
}

async function createLabNotification(report) {
  const notificationQuery = `
    INSERT INTO lab_notifications (report_id, patient_id, doctor_id, title, status, created_at)
    VALUES ($1, $2, $3, $4, 'PENDING', NOW())
    RETURNING *;
  `;
  
  const notificationTitle = `New ${report.uploaded_by === 'patient' ? 'Patient' : 'Doctor'} Report: ${report.title}`;
  
  // Fixed: Use report.id instead of report.report_id (the column returned from INSERT is likely 'id')
  await pool.query(notificationQuery, [
    report.id || report.report_id, // Handle both cases
    report.patient_id,
    report.doctor_id,
    notificationTitle
  ]);
}

async function getReportsByPatient(patient_id) {
  const query = "SELECT * FROM test_reports WHERE patient_id = $1 ORDER BY created_at DESC";
  const result = await pool.query(query, [patient_id]);
  return result.rows;
}

async function getReportsByDoctor(doctor_id) {
  const query = "SELECT * FROM test_reports WHERE doctor_id = $1 ORDER BY created_at DESC";
  const result = await pool.query(query, [doctor_id]);
  return result.rows;
}

async function getReportById(report_id) {
  // Updated to handle both id and report_id column names
  const result = await pool.query("SELECT * FROM test_reports WHERE id = $1 OR report_id = $1", [report_id]);
  return result.rows[0];
}

async function deleteReport(report_id) {
  // Updated to handle both id and report_id column names
  const result = await pool.query("DELETE FROM test_reports WHERE id = $1 OR report_id = $1 RETURNING *", [report_id]);
  return result.rows[0];
}

// Lab notification functions
async function getLabNotifications() {
  const query = `
    SELECT ln.*, tr.title as report_title, tr.description, tr.result,
           p.name as patient_name, p.email as patient_email,
           d.name as doctor_name, d.email as doctor_email
    FROM lab_notifications ln
    JOIN test_reports tr ON ln.report_id = tr.id OR ln.report_id = tr.report_id
    JOIN patients p ON ln.patient_id = p.patient_id
    JOIN doctors d ON ln.doctor_id = d.doctor_id
    ORDER BY ln.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
}

async function updateNotificationStatus(notification_id, status) {
  const query = "UPDATE lab_notifications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *";
  const result = await pool.query(query, [status, notification_id]);
  return result.rows[0];
}

module.exports = { 
  addReport, 
  getReportsByPatient, 
  getReportsByDoctor, 
  getReportById, 
  deleteReport,
  getLabNotifications,
  updateNotificationStatus
};