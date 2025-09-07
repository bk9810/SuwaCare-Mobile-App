const express = require("express");
const router = express.Router();
const {
  assignDoctor,
  getDoctorPatients,
  getPatientDoctors,
} = require("../controllers/doctorPatientController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/assign", authMiddleware, assignDoctor);
router.get("/doctor/:doctorId", authMiddleware, getDoctorPatients);
router.get("/patient/:patientId", authMiddleware, getPatientDoctors);

module.exports = router;
