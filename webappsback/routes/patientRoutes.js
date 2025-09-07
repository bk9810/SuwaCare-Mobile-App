const express = require("express");
const router = express.Router();
const patientModel = require("../models/patientModel");

router.get("/", async (req, res) => {
    try {
        const patients = await patientModel.getAllPatients();
        res.json(patients);
    } catch (err){
        console.error("GET /api/admin/patients error:", err);
        res.status(500).json({ error: err.message});
    }
});

module.exports = router;