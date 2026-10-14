const Admin = require('../models/admin.model');
const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/apiResponse');

// Helper to generate JWT token
const generateToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

/**
 * @desc    Login Admin
 * @route   POST /api/auth/login
 */
const loginAdmin = async (req, res, next) => { 
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide an email and password');
        }

        // Fetch admin with password explicitly included
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            res.status(401);
            throw new Error('Invalid credentials'); // Generic message for security
        }

        if (!admin.isActive) {
            res.status(403);
            throw new Error('Account deactivated. Contact super admin');
        }

        if (admin.isLocked()) {
            res.status(423);
            throw new Error('Account locked for 15 minutes due to too many failed attempts');
        }

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            admin.loginAttempts += 1;
            if (admin.loginAttempts >= 5) {
                // Lock for 15 minutes
                admin.lockUntil = Date.now() + 15 * 60 * 1000; 
            }
            await admin.save();
            
            res.status(401);
            throw new Error('Invalid credentials');
        }

        // Successful login - reset attempts and update last login
        admin.loginAttempts = 0;
        admin.lockUntil = null;
        admin.lastLogin = Date.now();
        await admin.save();

        const token = generateToken(admin._id, admin.email, admin.role);

        // Set JWT in HTTP-Only Cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        res.cookie('adminToken', token, cookieOptions);

        return sendResponse(res, 200, true, 'Logged in successfully', {
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                lastLogin: admin.lastLogin
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout Admin
 * @route   POST /api/auth/logout
 */
const logoutAdmin = async (req, res, next) => {
    try {
        res.cookie('adminToken', 'none', {
            httpOnly: true,
            expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
        });

        return sendResponse(res, 200, true, 'Logged out successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current logged in Admin
 * @route   GET /api/auth/me
 */
const getMe = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        return sendResponse(res, 200, true, 'Admin profile fetched', admin);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Change Admin Password
 * @route   PUT /api/auth/change-password
 */
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            res.status(400);
            throw new Error('Please provide current, new, and confirmation passwords');
        }

        if (newPassword !== confirmNewPassword) {
            res.status(400);
            throw new Error('New passwords do not match');
        }

        // Strict Password Regex: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            res.status(400);
            throw new Error('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.');
        }

        const admin = await Admin.findById(req.admin.id).select('+password');

        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(401);
            throw new Error('Incorrect current password');
        }

        // Pre-save hook will automatically hash this
        admin.password = newPassword;
        await admin.save();

        return sendResponse(res, 200, true, 'Password updated successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginAdmin,
    logoutAdmin,
    getMe,
    changePassword
};