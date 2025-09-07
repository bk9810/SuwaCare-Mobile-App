const express = require("express");
const router = express.Router();
const DoctorPatient = require("../models/doctorPatientModel");

// POST: assign patient to doctor
router.post("/assign", async (req, res) => {
  try {
    const { doctor_id, patient_id } = req.body;
    const record = await DoctorPatient.assign(doctor_id, patient_id);
    res.status(201).json(record || { message: "Already assigned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: all patients for doctor
router.get("/doctor/:doctor_id", async (req, res) => {
  try {
    const patients = await DoctorPatient.findPatientsByDoctor(req.params.doctor_id);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: all doctors for patient
router.get("/patient/:patient_id", async (req, res) => {
  try {
    const doctors = await DoctorPatient.findDoctorsByPatient(req.params.patient_id);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
