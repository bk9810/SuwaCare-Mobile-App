const express = require('express');
const router = express.Router();
const { registerPatient, loginPatient, getPatientProfile, updatePatientProfile } = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerPatient);
router.post('/login', loginPatient);
router.get('/:id', authMiddleware, getPatientProfile);
router.put('/:id', authMiddleware, updatePatientProfile);

module.exports = router;
