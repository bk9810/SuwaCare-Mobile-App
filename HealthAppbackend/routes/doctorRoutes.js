const express = require("express");
const router = express.Router();
const {
  registerDoctor,
  getDoctors,
  getDoctorById,
  updateDoctorStatus,
  loginDoctor,
  updateDoctorProfile
} = require("../controllers/doctorController");

const authMiddleware = require('../middleware/authMiddleware');

// 🔧 PUBLIC ROUTES (no auth required)
// Doctor Register
router.post('/register', registerDoctor);

// Doctor Login
router.post('/login', loginDoctor);

// 🔧 PROTECTED ROUTES (auth required)
// Get all doctors (with optional filtering) – only logged-in users
// Example: GET /api/doctors?disease=Cardiology
router.get('/', authMiddleware, getDoctors);

// Get single doctor by ID
router.get('/:id', authMiddleware, getDoctorById);

// Admin updates doctor status (approve/reject)
router.put('/:id/status', authMiddleware, updateDoctorStatus);

router.put('/:id/profile', authMiddleware, updateDoctorProfile);

module.exports = router;