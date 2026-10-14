const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String,
        required: [true, 'Password is required'],     
        minlength: 8,
        select: false // Never return password by default
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin'],
        default: 'admin'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Virtual property to check if account is currently locked
adminSchema.virtual('isAccountLocked').get(function() {
    return this.lockUntil && this.lockUntil > Date.now();
});

// Instance method to check lock status
adminSchema.methods.isLocked = function() {
    return this.lockUntil && this.lockUntil > Date.now();
};

// FIX: Removed the 'next' parameter. Mongoose handles async promises automatically.
adminSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// Instance method to compare incoming password with hashed password
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;