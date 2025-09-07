const Caregiver = require('../models/caregiverModel');

exports.registerCaregiver = async (req, res) => {
  try {
    const { patientId } = req.params;
    const caregiver = await Caregiver.create(patientId, req.body);
    res.json(caregiver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register caregiver" });
  }
};

exports.getCaregivers = async (req, res) => {
  try {
    const { patientId } = req.params;
    const caregivers = await Caregiver.findByPatient(patientId);
    res.json(caregivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch caregivers" });
  }
};

exports.updateCaregiver = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Caregiver.update(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update caregiver" });
  }
};
