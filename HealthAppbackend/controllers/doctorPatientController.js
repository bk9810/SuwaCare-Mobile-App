const DoctorPatient = require("../models/doctorPatientsModel");

const assignDoctor = async (req, res) => {
  try {
    const { doctor_id, patient_id } = req.body;
    const assignment = await DoctorPatient.assignDoctorToPatient(doctor_id, patient_id);
    if (!assignment) return res.status(200).json({ message: "Already assigned" });
    res.status(201).json({ message: "Doctor assigned to patient", assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDoctorPatients = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const patients = await DoctorPatient.getPatientsForDoctor(doctorId);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPatientDoctors = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctors = await DoctorPatient.getDoctorsForPatient(patientId);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { assignDoctor, getDoctorPatients, getPatientDoctors };
