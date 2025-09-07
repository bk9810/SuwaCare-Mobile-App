// controllers/doctorController.js
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const doctorController = {
  // Register Doctor
  async registerDoctor(req, res) {
    try {
      const { name, email, password, phone, specialization } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const doctor = await Doctor.addDoctor({
        name,
        email,
        password: hashedPassword,
        phone,
        specialization,
      });

      res.status(201).json({ message: "Doctor registered, waiting for approval", doctor });
    } catch (err) {
      console.error("Register Doctor Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // Get Doctors (with filtering)
  async getDoctors(req, res) {
    try {
      const { disease, specialization } = req.query;
      const filter = disease || specialization;

      console.log('🏥 getDoctors called with filter:', filter);

      let doctors;
      if (filter) {
        doctors = await Doctor.getDoctorsBySpecialization(filter);
      } else {
        doctors = await Doctor.getAllDoctors();
      }

      // Only return approved doctors
      const approvedDoctors = doctors.filter(doc => doc.status === 'APPROVED');
      res.json(approvedDoctors);
    } catch (err) {
      console.error("Get Doctors Error:", err.message);
      res.status(500).json({ error: "Failed to fetch doctors", details: err.message });
    }
  },

  // Get Doctor by ID - FIXED: Better error handling and validation
  async getDoctorById(req, res) {
    const { id } = req.params;
    console.log("👉 Fetching doctor profile for ID:", id);

    try {
      // Validate ID parameter
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid doctor ID provided" });
      }

      const doctor = await Doctor.getDoctorById(id);
      
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      // Don't send password in response
      const { password, ...doctorData } = doctor;
      res.json(doctorData);
      
    } catch (err) {
      console.error("Get Doctor by ID Error:", err);
      res.status(500).json({ 
        error: "Failed to fetch doctor profile", 
        details: err.message 
      });
    }
  },

  // Update Doctor status (Approve / Reject) – Admin Only
  async updateDoctorStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    try {
      const doctor = await Doctor.updateDoctorStatus(id, status);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
      res.json({ message: "Doctor status updated", doctor });
    } catch (err) {
      console.error("Update Status Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // Doctor Login (with JWT)
  async loginDoctor(req, res) {
    const { email, password } = req.body;

    try {
      const doctor = await Doctor.doctorLogin(email);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });

      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      if (doctor.status === "PENDING") {
        return res.status(403).json({ message: "Approval pending", status: "PENDING" });
      }
      if (doctor.status === "REJECTED") {
        return res.status(403).json({ message: "Rejected by admin", status: "REJECTED" });
      }

      // Generate JWT with consistent payload
      const token = jwt.sign(
        { doctor_id: doctor.doctor_id, type: 'doctor' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: "Login successful",
        token,
        doctor: {
          doctor_id: doctor.doctor_id,
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          status: doctor.status
        }
      });
    } catch (err) {
      console.error("Login Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // Update Doctor Profile - FIXED: Better validation and error handling
  async updateDoctorProfile(req, res) {
    const { id } = req.params;
    const { name, phone, specialization } = req.body;

    try {
      // Validate input
      if (!name || !phone || !specialization) {
        return res.status(400).json({ error: "All fields (name, phone, specialization) are required" });
      }

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: "Invalid doctor ID" });
      }

      const doctor = await Doctor.updateDoctorProfile(id, { name, phone, specialization });
      
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      // Don't send password in response
      const { password, ...doctorData } = doctor;
      res.json({ message: "Profile updated successfully", doctor: doctorData });
      
    } catch (err) {
      console.error("Update Profile Error:", err.message);
      res.status(500).json({ 
        error: "Failed to update profile", 
        details: err.message 
      });
    }
  },


  
};

module.exports = doctorController;