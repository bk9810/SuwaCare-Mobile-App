//ChronicDiseaseRoutes
const express = require('express');
const router = express.Router();
const {addDisease, getDiseasesByPatient, updateDisease} = require('../controllers/chronicDiseaseController')

const authMiddleware = require('../middleware/authMiddleware');

router.post('/:patientId', authMiddleware, addDisease);
router.get('/:patientId', authMiddleware, getDiseasesByPatient);
router.put('/update/:id', authMiddleware, updateDisease);

module.exports = router;



