const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { sendTextMessage, sendVoiceMessage } = require('../controllers/chatbot.controller');

router.post('/message', protect, sendTextMessage);
router.post('/voice', protect, sendVoiceMessage);

module.exports = router;  