const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/doctorProfileController");
const authMiddleware = require("../middleware/authMiddleware");

// Get profile
router.get("/:id", authMiddleware, getProfile);

// Update profile
router.put("/:id/profile", authMiddleware, updateProfile);

module.exports = router;
