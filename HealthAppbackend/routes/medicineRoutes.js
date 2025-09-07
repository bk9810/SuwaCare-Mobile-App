const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController'); // ensure this exists
const authMiddleware = require('../middleware/authMiddleware');

// Example endpoints (adjust to your controller names)
router.post('/prescription/:prescriptionId', authMiddleware, medicineController.addMedicineToPrescription);
router.get('/prescription/:prescriptionId', authMiddleware, medicineController.getPrescriptionMedicines);
router.put('/:medicineId', authMiddleware, medicineController.updateMedicine);

module.exports = router;
