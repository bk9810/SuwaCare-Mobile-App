// controllers/appointmentController.js - QUICK TEST VERSION
const Appointment = require('../models/appointmentModel');
const doctorModel = require('../models/doctorModel');

const appointmentController = {
  // Patient books an appointment - SIMPLIFIED FOR TESTING
  async bookAppointment(req, res) {
    try {
      // Get patient ID from token or request body
      const patientId = req.body.patient_id || (req.user && req.user.patientId);
      
      console.log('📋 Booking request received:', {
        patientId,
        body: req.body,
        userFromToken: req.user
      });

      if (!patientId) {
        return res.status(400).json({ message: 'patient_id required (or use auth token).' });
      }

      const { doctor_id, department, reason, scheduled_at } = req.body;
      
      if (!doctor_id || !department) {
        return res.status(400).json({ message: 'doctor_id and department are required.' });
      }

      // Convert doctor_id to number for database query
      const doctorIdNum = parseInt(doctor_id);
      
      console.log('🔍 Doctor validation:', {
        original_doctor_id: doctor_id,
        parsed_doctor_id: doctorIdNum,
        department,
        isValidNumber: !isNaN(doctorIdNum)
      });

      // SIMPLIFIED VALIDATION - Just check if doctor exists
      try {
        const doctor = await doctorModel.getDoctorById(doctorIdNum);
        
        console.log('👨‍⚕️ Doctor lookup result:', {
          found: !!doctor,
          doctor: doctor ? {
            id: doctor.doctor_id,
            name: doctor.name,
            specialization: doctor.specialization,
            status: doctor.status
          } : null
        });

        if (!doctor) {
          return res.status(404).json({ 
            message: `Doctor with ID ${doctorIdNum} not found in database.`,
            debug: { requestedId: doctorIdNum, type: typeof doctorIdNum }
          });
        }

        // Only check if doctor is approved (skip specialization check for now)
        if (doctor.status !== 'APPROVED') {
          return res.status(400).json({ 
            message: `Doctor ${doctor.name} is not approved (status: ${doctor.status}).` 
          });
        }

        console.log('✅ Doctor validation passed, creating appointment...');

      } catch (dbError) {
        console.error('❌ Database error during doctor lookup:', dbError);
        return res.status(500).json({ 
          message: 'Database error while checking doctor.',
          error: dbError.message 
        });
      }

      // Create the appointment
      const appointment = await Appointment.create({
        patient_id: patientId,
        doctor_id: doctorIdNum,
        department,
        reason: reason || null,
        scheduled_at: scheduled_at || null
      });

      console.log('✅ Appointment created:', appointment);

      return res.status(201).json({ 
        message: 'Appointment created successfully.', 
        appointment 
      });
      
    } catch (err) {
      console.error('❌ bookAppointment error:', err);
      return res.status(500).json({ 
        message: 'Internal server error.',
        error: err.message 
      });
    }
  },

  // Rest of your methods remain the same...
  async getPatientAppointments(req, res) {
    try {
      const patientId = req.params.patientId || (req.user && req.user.patientId);
      if (!patientId) {
        return res.status(400).json({ message: 'patientId required.' });
      }
      const appointments = await Appointment.findByPatient(patientId);
      return res.json(appointments);
    } catch (err) {
      console.error('getPatientAppointments error:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  async getDoctorAppointments(req, res) {
    try {
      const doctorId = req.params.doctorId || (req.user && req.user.doctorId);
      if (!doctorId) {
        return res.status(400).json({ message: 'doctorId required.' });
      }
      const appointments = await Appointment.findByDoctor(doctorId);
      return res.json(appointments);
    } catch (err) {
      console.error('getDoctorAppointments error:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  },

  async updateAppointmentStatus(req, res) {
    try {
      const appointmentId = req.params.appointmentId;
      const { status } = req.body;
      if (!['ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Use ACCEPTED or REJECTED.' });
      }

      const doctorIdFromToken = req.user && req.user.doctorId;
      const appointment = await Appointment.getById(appointmentId);
      if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });

      if (doctorIdFromToken && Number(doctorIdFromToken) !== Number(appointment.doctor_id)) {
        return res.status(403).json({ message: 'Not allowed to update this appointment.' });
      }

      const updated = await Appointment.updateStatus(appointmentId, status);
      return res.json({ message: 'Appointment status updated.', appointment: updated });
    } catch (err) {
      console.error('updateAppointmentStatus error:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

module.exports = appointmentController;