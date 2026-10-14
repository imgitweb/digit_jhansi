const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const sendResponse = require('../utils/apiResponse');

const protect = async (req, res, next) => {
    let token;

    // 1. Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // 2. Fallback to extracting token from httpOnly cookie
    else if (req.cookies && req.cookies.adminToken) {
        token = req.cookies.adminToken;
    }

    if (!token) {    
        return sendResponse(res, 401, false, 'Not authorized, no token provided');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find Admin and exclude password
        const admin = await Admin.findById(decoded.id).select('-password');

        if (!admin || !admin.isActive) {
            return sendResponse(res, 401, false, 'Not authorized, account not found or deactivated');
        }

        // Attach admin to request object
        req.admin = admin;
        next();
    } catch (error) {
        return sendResponse(res, 401, false, 'Not authorized, token invalid or expired');
    }
};

module.exports = { protect };