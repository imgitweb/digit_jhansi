const mongoose = require('mongoose');

const enablerSchema = new mongoose.Schema({
    enablerId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    // Identity
    companyName: {
        type: String,
        required: [true, 'Company Name is required'],
        trim: true
    },
    ownerName: {
        type: String,
        required: [true, 'Owner Name is required'],
        trim: true
    },
    contactNumber: {
        type: String,  
        required: [true, 'Contact Number is required'],
        unique: true,
        sparse: true,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: '',
        validate: {
            validator: function(v) {
                return !v || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    // Location
    address: {
        fullAddress: { type: String, trim: true, default: '' },
        city: { type: String, trim: true, default: '' },
        district: { type: String, trim: true, default: '' },
        state: { type: String, trim: true, default: '' }
    },
    // Service Profile
    serviceProfile: {
        category: { type: String, trim: true, default: '' },
        servicesOffered: [{ type: String, trim: true }],
        yearsOfExperience: { type: Number, default: 0 },
        numberOfClients: { type: Number, default: 0 },
        clientTypes: { type: String, trim: true, default: '' },
        pricingModel: { type: String, trim: true, default: '' },
        serviceArea: { type: String, trim: true, default: '' }
    },
    // Capabilities (Boolean flags)
    capabilities: {
        supportsLocalBusinesses: { type: Boolean, default: false },
        handlesEcommercePlatforms: { type: Boolean, default: false },
        platformsSupported: [{ type: String, trim: true }],
        providesPackaging: { type: Boolean, default: false },
        providesLogistics: { type: Boolean, default: false },
        providesProductListing: { type: Boolean, default: false },
        providesProductPhotography: { type: Boolean, default: false },
        providesQualityAssurance: { type: Boolean, default: false },
        providesDigitalMarketing: { type: Boolean, default: false },
        providesWarehouse: { type: Boolean, default: false }
    },
    // Business Details
    businessDetails: {
        techCapabilityLevel: { 
            type: String, 
            enum: ['Basic', 'Intermediate', 'Advanced', ''], 
            default: '' 
        },
        teamSize: { type: Number, default: 0 },
        turnoverRange: { type: String, trim: true, default: '' },
        keyStrengths: [{ type: String, trim: true }],
        certifications: [{ type: String, trim: true }],
        partnerships: [{ type: String, trim: true }]
    },
    // Flags
    willingToOnboardLocalSellers: { type: Boolean, default: false },
    notes: { type: String, trim: true, default: '' },

    registrationSource: {
        type: String,
        enum: ['Excel Upload', 'Manual Entry'],
        default: 'Manual Entry'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Verified'],
        default: 'Active'
    }
}, {
    timestamps: true
});

// Indexing for optimized search queries (accessed via $or regex in controller)
enablerSchema.index({ 
    companyName: 'text', 
    ownerName: 'text', 
    'address.city': 'text', 
    'serviceProfile.category': 'text' 
});

const Enabler = mongoose.model('Enabler', enablerSchema);
module.exports = Enabler;