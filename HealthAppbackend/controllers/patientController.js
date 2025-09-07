// controllers/patientController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patientModel');
require('dotenv').config();


const registerPatient = async (req, res) => {
  try {
    const { name, email, phone, password, address, dob } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existing = await Patient.getPatientByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = await Patient.createPatient({ name, email, phone, password: hashedPassword, address, dob });

    res.status(201).json({ patient: newPatient });
  } catch (err) {
    console.error('Register Patient Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const patient = await Patient.getPatientByEmail(email);
    if (!patient) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, patient.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ Generate JWT with consistent payload
    const payload = {
      type: "patient",
      patient_id: patient.patient_id,
      name: patient.name,
      email: patient.email
    };

    const token = jwt.sign(
  { patient_id: patient.patient_id, type: 'patient' },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

    res.status(200).json({ token, patient });
  } catch (err) {
    console.error('Login Patient Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Patient Profile
const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.getPatientById(req.user.patient_id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patient);
  } catch (err) {
    console.error('Get Patient Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Patient Profile
const updatePatientProfile = async (req, res) => {
  try {
    const { id } = req.params; // patient_id from URL
    const { name, email, phone, address, dob } = req.body;

    const updated = await Patient.updatePatientById(id, { name, email, phone, address, dob });
    if (!updated) return res.status(404).json({ message: 'Patient not found' });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update Patient Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerPatient, loginPatient, getPatientProfile, updatePatientProfile };
