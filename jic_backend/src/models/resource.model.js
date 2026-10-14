const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    resourceId: {
        type: String,
        unique: true,
        sparse: true,  
        trim: true
    },
    fullName: {
        type: String,
        trim: true,
        default: ''
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: ''
    },
    dateOfBirth: {
        type: Date,
        default: null
    },   
    age: {
        type: Number,
        default: null
    },
    phoneNumber: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
    },
    address: {
        fullAddress: { type: String, trim: true, default: '' },
        village: { type: String, trim: true, default: '' },
        block: { type: String, trim: true, default: '' },
        district: { type: String, trim: true, default: '' },
        state: { type: String, trim: true, default: '' }
    },
    education: {
        highestQualification: { type: String, trim: true, default: '' },
        degreeName: { type: String, trim: true, default: '' },
        specialization: { type: String, trim: true, default: '' },
        collegeUniversity: { type: String, trim: true, default: '' },
        passoutYear: { type: String, trim: true, default: '' }
    },
    employment: {
        currentStatus: {
            type: String,
            enum: ['Employed', 'Unemployed', 'Student', 'Freelancer', 'Self-Employed', 'Fresher', ''],
            default: ''
        },
        employerName: { type: String, trim: true, default: '' },
        jobRole: { type: String, trim: true, default: '' },
        yearsOfExperience: { type: Number, default: 0 },
        lastMonthSalary: { type: String, default: 0 }
    },
    skills: {
        primary: {
            name: { type: String, trim: true, default: '' },
            level: { type: String, trim: true, default: '' }
        },
        secondary: {
            name: { type: String, trim: true, default: '' },
            level: { type: String, trim: true, default: '' }
        },
        tertiary: {
            name: { type: String, trim: true, default: '' },
            level: { type: String, trim: true, default: '' }
        }
    },
    interests: {
        type: [{ type: String, trim: true }],
        default: []
    },
    workPreference: {
        preferredWorkType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Freelance', 'Contract', ''],
            default: ''
        },
        expectedSalary: { type: String, default: 0 },
        availability: { type: String, trim: true, default: '' }
    },
    digitalProfile: {
        digitalLiteracyLevel: {
            type: String,
            enum: ['None', 'Basic', 'Intermediate', 'Advanced', ''],
            default: ''
        },
        languagesKnown: [{ type: String, trim: true }],
        certifications: [{ type: String, trim: true }],
        ownsSmartphone: { type: Boolean, default: false },
        hasInternetAccess: { type: Boolean, default: false }
    },
    flags: {
        willingToRelocate: { type: Boolean, default: false },
        willingForTraining: { type: Boolean, default: false }
    },
    notes: {
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
        enum: ['Active', 'Inactive', 'Placed', 'Blacklisted'],
        default: 'Active'
    }
}, {
    timestamps: true
});

// Text indexing for optimized search queries
resourceSchema.index({ 
    fullName: 'text', 
    'skills.primary.name': 'text', 
    'address.block': 'text', 
    'address.village': 'text' 
});


const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;