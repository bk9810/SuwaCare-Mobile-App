// testReportRoutes.js
const express = require("express");
const router = express.Router();
const {
  addReport,
  getReportsByPatient,
  getReportsByDoctor,
  getReportById,
  deleteReport,
  getLabNotifications,
  updateNotificationStatus,
} = require("../controllers/testReportController");
const authMiddleware = require("../middleware/authMiddleware");

// Lab notification routes - MOVED TO TOP to avoid conflict with /:reportId
router.get("/lab/notifications", authMiddleware, getLabNotifications);
router.put("/lab/notifications/:notificationId", authMiddleware, updateNotificationStatus);

// Test Report routes - MOVED BELOW lab routes
router.post("/", authMiddleware, addReport);
router.get("/patient/:patientId", authMiddleware, getReportsByPatient);
router.get("/doctor/:doctorId", authMiddleware, getReportsByDoctor);
router.get("/:reportId", authMiddleware, getReportById);
router.delete("/:reportId", authMiddleware, deleteReport);

module.exports = router;