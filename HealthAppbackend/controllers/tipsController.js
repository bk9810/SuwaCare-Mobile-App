// controllers/tipsController.js
const ChronicDisease = require('../models/chronicDiseaseModel');
const { generateTipsForDisease } = require('../services/tipsService');

exports.getPersonalizedTips = async (req, res) => {
  try {
    const { patientId } = req.params;

    // get all chronic diseases for this patient
    const diseases = await ChronicDisease.findByPatient(patientId);

    let allTips = [];
    diseases.forEach(d => {
      const diseaseTips = generateTipsForDisease(d.disease_name);
      allTips = [...allTips, ...diseaseTips];
    });

    res.json({ tips: allTips });
  } catch (err) {
    console.error("Error generating tips:", err);
    res.status(500).json({ error: err.message });
  }
};
