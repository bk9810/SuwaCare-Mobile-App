//ChronicDiseaseController
const ChronicDisease = require('../models/chronicDiseaseModel');

exports.addDisease = async (req, res) => {
  try {
    const { patientId } = req.params;
    const disease = await ChronicDisease.create(patientId, req.body);
    res.json(disease);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDiseasesByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const diseases = await ChronicDisease.findByPatient(patientId);
    res.json(diseases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const disease = await ChronicDisease.update(id, req.body);
    res.json(disease);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
