const Prescription = require('../models/prescriptionModel');
const PrescriptionMedicine = require('../models/prescriptionMedicineModel');

module.exports = {
  async addMedicineToPrescription(req, res) {
    try {
      const { prescriptionId } = req.params;
      const { name, dosage, frequency, duration, instructions } = req.body;
      // simple existence check
      const pres = await Prescription.getById(prescriptionId);
      if (!pres) return res.status(404).json({ message: 'Prescription not found' });

      const med = await PrescriptionMedicine.add({
        prescription_id: prescriptionId,
        name, dosage, frequency, duration, instructions
      });
      res.status(201).json(med);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async getPrescriptionMedicines(req, res) {
    try {
      const { prescriptionId } = req.params;
      const meds = await PrescriptionMedicine.getByPrescription(prescriptionId);
      res.json(meds);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async updateMedicine(req, res) {
    try {
      const { medicineId } = req.params;
      const updated = await PrescriptionMedicine.updateById(medicineId, req.body);
      if (!updated) return res.status(404).json({ message: 'Not found or nothing to update' });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};
