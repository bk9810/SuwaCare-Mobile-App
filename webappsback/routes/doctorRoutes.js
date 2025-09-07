// routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const doctorModel = require("../models/doctorModel");

router.get("/", async (req, res) => {
  try {
    const doctors = await doctorModel.getAllDoctors();
    res.json(doctors);
  } catch (err) {
    console.error("GET /api/admin/doctors error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await doctorModel.updateDoctorStatus(id, status);
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/admin/doctors/:id/status error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
