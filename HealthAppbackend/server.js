//server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const patientRoutes = require("./routes/patientRoutes");
const caregiverRoutes = require("./routes/caregiverRoutes");
const chronicDiseaseRoutes = require("./routes/chronicDiseaseRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const patientAppointmentRoutes = require("./routes/patientAppointments");
const doctorAppointmentRoutes = require("./routes/doctorAppointments");

const medicineRoutes = require("./routes/medicineRoutes");
const doctorPatientRoutes = require("./routes/doctorPatientRoutes");
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const testReportRoutes = require('./routes/testReportRoutes');
const doctorPatientsRoutes = require('./routes/doctorPatientsRoutes');
const consultantRoutes = require("./routes/consultantRoutes");


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Existing
app.use("/api/patients", patientRoutes);
app.use("/api/caregivers", caregiverRoutes);
app.use("/api/chronic-diseases", chronicDiseaseRoutes);
app.use("/api/doctors", doctorRoutes);

// Appointments
app.use("/api/patient/appointments", patientAppointmentRoutes);
app.use("/api/doctor/appointments", doctorAppointmentRoutes);
app.use("/api/medicines", medicineRoutes);
app.use('/api/tips', require('./routes/tipsRoutes'));
app.use("/api/doctor-patients", doctorPatientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use("/api/test-reports", testReportRoutes);
app.use("/api/doctor-patients", doctorPatientsRoutes);
app.use("/api/doctor-patients/patient/:patientId", consultantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://10.195.21.165:${PORT}`));
