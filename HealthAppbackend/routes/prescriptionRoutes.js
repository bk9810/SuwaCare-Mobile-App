// routes/prescriptionRoutes.js
const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/authMiddleware');

// Prescription CRUD
router.post('/', authMiddleware, prescriptionController.createPrescription);
router.get('/:id', authMiddleware, prescriptionController.getPrescriptionById);
router.get('/patient/:patientId', authMiddleware, prescriptionController.getByPatient);
router.get('/doctor/:doctorId', authMiddleware, prescriptionController.getByDoctor);

// Medicine management
router.post('/:prescriptionId/medicines', authMiddleware, prescriptionController.addMedicine);
router.get('/:prescriptionId/medicines', authMiddleware, prescriptionController.getMedicines);
router.put('/medicines/:medicineId', authMiddleware, prescriptionController.updateMedicine);

module.exports = router;
