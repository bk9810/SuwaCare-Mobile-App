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


router.post('/register', registerDoctor);


router.post('/login', loginDoctor);


router.get('/', authMiddleware, getDoctors);


router.get('/:id', authMiddleware, getDoctorById);


router.put('/:id/status', authMiddleware, updateDoctorStatus);

router.put('/:id/profile', authMiddleware, updateDoctorProfile);


module.exports = router;