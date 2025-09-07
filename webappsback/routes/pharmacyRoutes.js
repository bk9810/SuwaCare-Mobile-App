const express = require("express");
const Pharmacy = require("../models/pharmacyModel");
const router = express.Router();

// ➕ Register new pharmacy
router.post("/add", async (req, res) => {
  try {
    const pharmacy = await Pharmacy.addPharmacy(req.body);
    res.status(201).json({ message: "Pharmacy registered", pharmacy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering pharmacy" });
  }
});

// 🔑 Pharmacy login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const pharmacy = await Pharmacy.findByUsername(username);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    // ⚠️ for now plain text (later bcrypt.compare)
    if (pharmacy.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", pharmacy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});

module.exports = router;
