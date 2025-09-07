const express = require("express");
const router = express.Router();
const consultantController = require("../controllers/consultantController");


router.post("/", consultantController.createRequest);


router.get("/doctor/:doctor_id", consultantController.getRequestsForDoctor);
router.get("/patient/:patient_id", consultantController.getRequestsForPatient);


router.put("/:consultant_id/accept", consultantController.acceptRequest);
router.put("/:consultant_id/reject", consultantController.rejectRequest);

module.exports = router;
