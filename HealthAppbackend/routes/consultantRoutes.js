const express = require("express");
const router = express.Router();
const consultantController = require("../controllers/consultantController");

// Patient creates request
router.post("/", consultantController.createRequest);

// Doctor & Patient view requests
router.get("/doctor/:doctor_id", consultantController.getRequestsForDoctor);
router.get("/patient/:patient_id", consultantController.getRequestsForPatient);

// Doctor accepts/rejects
router.put("/:consultant_id/accept", consultantController.acceptRequest);
router.put("/:consultant_id/reject", consultantController.rejectRequest);

module.exports = router;
