const express = require('express');
const { registerCaregiver, getCaregivers, updateCaregiver } = require('../controllers/caregiverController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:patientId', authMiddleware, registerCaregiver);
router.get('/:patientId', authMiddleware, getCaregivers);
router.put('/update/:id', authMiddleware, updateCaregiver);

module.exports = router;
