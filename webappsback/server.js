const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Admin doctor management routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/appointments", appointmentRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 WebApp Server running on port http://localhost:${PORT}`));
