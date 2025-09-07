const express = require("express");
const router = express.Router();
const appointmentModel = require("../models/appointmentModel");

router.get("/", async (req, res) => {
    try{
        const appointments = await appointmentModel.getAppointment();
        res.json(appointments);
    } catch (err){
        console.error("GET /api/admin/appointments error:", err);
        res.status(500).json({error: err.message});
    }


});

module.exports = router;