// testReportController.js
const TestReport = require("../models/testReportModel");

const addReport = async (req, res) => {
  try {
    const { patient_id, doctor_id, title, description, result, uploaded_by } = req.body;
    
    // Validation
    if (!patient_id || !doctor_id || !title || !description || !result || !uploaded_by) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!['patient', 'doctor'].includes(uploaded_by)) {
      return res.status(400).json({ error: "uploaded_by must be either 'patient' or 'doctor'" });
    }

    const report = await TestReport.addReport(patient_id, doctor_id, title, description, result, uploaded_by);
    res.status(201).json({ 
      success: true, 
      message: "Report uploaded successfully and lab has been notified", 
      report 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReportsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const reports = await TestReport.getReportsByPatient(patientId);
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReportsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const reports = await TestReport.getReportsByDoctor(doctorId);
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await TestReport.getReportById(reportId);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const deleted = await TestReport.deleteReport(reportId);
    if (!deleted) return res.status(404).json({ error: "Report not found" });
    res.json({ success: true, message: "Report deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lab notification endpoints
const getLabNotifications = async (req, res) => {
  try {
    const notifications = await TestReport.getLabNotifications();
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateNotificationStatus = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;
    
    if (!['PENDING', 'PROCESSED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be PENDING, PROCESSED, or COMPLETED" });
    }

    const notification = await TestReport.updateNotificationStatus(notificationId, status);
    res.json({ success: true, message: "Notification status updated", data: notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  addReport, 
  getReportsByPatient, 
  getReportsByDoctor, 
  getReportById, 
  deleteReport,
  getLabNotifications,
  updateNotificationStatus
};