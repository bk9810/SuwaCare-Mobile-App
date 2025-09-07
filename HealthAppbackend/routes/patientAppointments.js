// routes/patientAppointments.js
const express = require('express');
const router = express.Router();
const {bookAppointment, getPatientAppointments} = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/book', authMiddleware, bookAppointment);
router.get('/:patientId', authMiddleware, getPatientAppointments);

module.exports = router;
