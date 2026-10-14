const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { protect } = require('../middlewares/authMiddleware');
const { 
    loginAdmin, 
    logoutAdmin, 
    getMe, 
    changePassword 
} = require('../controllers/auth.controller');

// Rate limiting for login attempts (Max 10 requests per 15 minutes)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, 
    message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/login', loginLimiter, loginAdmin);  
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;