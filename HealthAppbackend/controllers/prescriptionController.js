// controllers/prescriptionController.js - WITH DEBUG LOGGING
const Prescription = require('../models/prescriptionModel');
const PrescriptionMedicine = require('../models/prescriptionMedicineModel');
const pool = require('../config/db');

const prescriptionController = {
  // Create a prescription (doctor only)
  async createPrescription(req, res) {
    try {
      console.log('📝 Creating prescription with user:', req.user);
      console.log('📝 Request body:', req.body);
      
      const user = req.user;
      if (!user || user.type !== 'doctor') {
        return res.status(403).json({ message: 'Only doctors can create prescriptions' });
      }

      const { appointment_id, notes } = req.body;
      if (!appointment_id) {
        return res.status(400).json({ message: 'appointment_id is required' });
      }

      // Validate the appointment
      const apptRes = await pool.query(
        'SELECT * FROM appointments WHERE appointment_id = $1',
        [appointment_id]
      );
      
      const appt = apptRes.rows[0];
      if (!appt) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      // ENHANCED DEBUG LOGGING
      const doctorId = user.doctor_id || user.doctorId || user.id;
      console.log('🔍 DOCTOR ID COMPARISON DEBUG:', {
        'user object': user,
        'extracted doctorId': doctorId,
        'doctorId type': typeof doctorId,
        'appointment.doctor_id': appt.doctor_id,
        'appointment.doctor_id type': typeof appt.doctor_id,
        'are they equal (===)': appt.doctor_id === doctorId,
        'are they equal (==)': appt.doctor_id == doctorId,
        'parseInt comparison': parseInt(appt.doctor_id) === parseInt(doctorId)
      });

      // FIX: Ensure both IDs are numbers for comparison
      const userDoctorId = parseInt(doctorId);
      const appointmentDoctorId = parseInt(appt.doctor_id);

      if (appointmentDoctorId !== userDoctorId) {
        console.log('❌ DOCTOR MISMATCH:', {
          userDoctorId,
          appointmentDoctorId,
          appointment: appt
        });
        return res.status(403).json({ 
          message: 'You are not the doctor for this appointment',
          debug: {
            userDoctorId,
            appointmentDoctorId,
            appointmentDetails: appt
          }
        });
      }

      if (appt.status !== 'ACCEPTED') {
        return res.status(400).json({ 
          message: `Cannot create prescription for appointment with status: ${appt.status}` 
        });
      }

      // Check if prescription already exists
      const existingRes = await pool.query(
        'SELECT * FROM prescriptions WHERE appointment_id = $1',
        [appointment_id]
      );
      
      if (existingRes.rows.length > 0) {
        return res.status(400).json({ message: 'Prescription already exists for this appointment' });
      }

      // Create prescription
      const prescription = await Prescription.create({
        appointment_id,
        doctor_id: appointmentDoctorId, // Use the parsed appointment doctor_id
        patient_id: appt.patient_id,
        notes: notes || null
      });

      console.log('✅ Prescription created:', prescription);
      return res.status(201).json({ prescription });
      
    } catch (err) {
      console.error('❌ Create Prescription Error:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  // ... rest of your methods remain the same
 async getPrescriptionById(req, res) {
  try {
    const { id } = req.params;
    const prescription = await Prescription.getById(id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    const user = req.user;
    if (user) {
      if (req.user.type === 'doctor' && prescription.doctor_id !== req.user.doctor_id) {
  return res.status(403).json({ message: 'Access denied' });
}
if (req.user.type === 'patient' && prescription.patient_id !== req.user.patient_id) {
  return res.status(403).json({ message: 'Access denied' });
}
    }

    return res.json({ prescription });
  } catch (err) {
    console.error('❌ Get Prescription Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
},

  async getByPatient(req, res) {
    try {
      const { patientId } = req.params;
      
      // Check permissions
      const user = req.user;
      if (user?.type === 'patient') {
        const userPatientId = user.patient_id || user.id;
        if (userPatientId !== parseInt(patientId)) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }

      const prescriptions = await Prescription.getByPatient(patientId);
      return res.json(prescriptions);
      
    } catch (err) {
      console.error('❌ GetByPatient Error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  async getByDoctor(req, res) {
    try {
      const { doctorId } = req.params;
      
      // Check permissions
      const user = req.user;
      if (user?.type === 'doctor') {
        const userDoctorId = user.doctor_id || user.doctorId || user.id;
        if (userDoctorId !== parseInt(doctorId)) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }

      const prescriptions = await Prescription.getByDoctor(doctorId);
      return res.json(prescriptions);
      
    } catch (err) {
      console.error('❌ GetByDoctor Error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Medicine management
  async addMedicine(req, res) {
    try {
      const { prescriptionId } = req.params;
      const { name, dosage, frequency, duration, instructions } = req.body;
      
      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Medicine name is required' });
      }

      // Check if prescription exists
      const prescription = await Prescription.getById(prescriptionId);
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }

      // Check permissions - only the prescribing doctor can add medicines
      const user = req.user;
      if (user?.type === 'doctor') {
        const userDoctorId = user.doctor_id || user.doctorId || user.id;
        if (userDoctorId !== prescription.doctor_id) {
          return res.status(403).json({ message: 'Only the prescribing doctor can add medicines' });
        }
      }

      const medicine = await PrescriptionMedicine.add({
        prescription_id: prescriptionId,
        name: name.trim(),
        dosage,
        frequency,
        duration,
        instructions
      });

      console.log('💊 Medicine added:', medicine);
      return res.status(201).json({ medicine });
      
    } catch (err) {
      console.error('❌ Add Medicine Error:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  async getMedicines(req, res) {
    try {
      const { prescriptionId } = req.params;
      
      // Check if prescription exists
      const prescription = await Prescription.getById(prescriptionId);
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }

      const medicines = await PrescriptionMedicine.getByPrescription(prescriptionId);
      return res.json(medicines);
      
    } catch (err) {
      console.error('❌ Get Medicines Error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  async updateMedicine(req, res) {
    try {
      const { medicineId } = req.params;
      const updates = req.body;

      if (updates.name && !updates.name.trim()) {
        return res.status(400).json({ message: 'Medicine name cannot be empty' });
      }

      const updatedMedicine = await PrescriptionMedicine.updateById(medicineId, updates);
      if (!updatedMedicine) {
        return res.status(404).json({ message: 'Medicine not found or nothing to update' });
      }

      console.log('💊 Medicine updated:', updatedMedicine);
      return res.json({ medicine: updatedMedicine });
      
    } catch (err) {
      console.error('❌ Update Medicine Error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = prescriptionController;