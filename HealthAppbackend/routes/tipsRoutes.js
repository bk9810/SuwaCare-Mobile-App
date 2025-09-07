// routes/tipsRoutes.js
const express = require('express');
const router = express.Router();
const { getPersonalizedTips } = require('../controllers/tipsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:patientId', authMiddleware, getPersonalizedTips);

module.exports = router;
