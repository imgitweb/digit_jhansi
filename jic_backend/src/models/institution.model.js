const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
    institutionId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    serialNo: {
        type: String,
        trim: true,
        default: ''
    },
    institutionName: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        default: ''
    },
    address: {
        type: String,
        trim: true,
        default: ''
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    institutionType: {
        type: String,
        trim: true,
        default: ''
    },
    affiliation: {
        type: String,
        trim: true,
        default: ''
    },
    coursesOffered: {
        type: String,
        trim: true,
        default: ''
    },
    website: {
        type: String,
        trim: true,
        default: ''
    },
    registrationSource: {
        type: String,
        enum: ['Excel Upload', 'Manual Entry'],
        default: 'Manual Entry'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

institutionSchema.index({ institutionName: 'text', address: 'text', institutionType: 'text', affiliation: 'text' });

const Institution = mongoose.model('Institution', institutionSchema);
module.exports = Institution;