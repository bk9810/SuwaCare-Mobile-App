// routes/doctorAppointments.js
const express = require('express');
const router = express.Router();
const {getDoctorAppointments, updateAppointmentStatus} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:doctorId', authMiddleware, getDoctorAppointments);
router.put('/:appointmentId', authMiddleware, updateAppointmentStatus);

module.exports = router;
