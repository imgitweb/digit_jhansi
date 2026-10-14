// IMPORTANT — ONE-TIME MIGRATION: After deploying, run in MongoDB shell:
// db.industry50lpluses.dropIndex("phoneNumber_1")
// This removes the old unique phone index that was blocking duplicate phone numbers.

const mongoose = require('mongoose');

const industry50LPlusSchema = new mongoose.Schema({
    industryId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    // Identity
    companyName: {
        type: String,
        trim: true,
        default: '' // FIX: Removed required validator
    },
    ownerCeoName: {
        type: String,
        trim: true,
        default: '' // FIX: Removed required validator
    },
    businessCategory: {
        type: String,
        trim: true,
        default: ''
    },
    industryType: {
        type: String,
        trim: true,
        default: ''
    },
    natureOfBusiness: {
        type: String,
        trim: true,
        default: ''
    },
    shortCompanyProfile: {
        type: String,
        trim: true,
        default: ''
    },
    yearEstablished: {
        type: Number,
        default: null
    },
    
    // Contact & Web
    phoneNumber: {
        type: String,
        trim: true,
        default: '' // FIX: Removed required, unique, sparse, match
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: '' // FIX: Removed email format validator
    },
    websiteUrl: {
        type: String,
        trim: true,
        default: ''
    },

    // Location
    address: {
        fullAddress: { type: String, trim: true, default: '' },
        city: { type: String, trim: true, default: '' },
        district: { type: String, trim: true, default: '' },
        state: { type: String, trim: true, default: '' }
    },

    // Registration & Compliance
    compliance: {
        msmeRegistered: { type: Boolean, default: false },
        gstRegistered: { type: Boolean, default: false },
        companyRegistrationType: { type: String, trim: true, default: '' },
        certifications: [{ type: String, trim: true }]
    },

    // Business Scale
    scale: {
        lastYearTurnover: { type: String, default: 0 },
        numberOfEmployees: { type: Number, default: 0 },
        supplyCapacity: { type: String, trim: true, default: '' },
        investmentRequirement: { type: String, default: 0 }
    },

    // Products & Market
    products: {
        keyProductsServices: { type: String, trim: true, default: '' },
        majorClients: { type: String, trim: true, default: '' },
        operationalArea: { type: String, trim: true, default: '' },
        logisticsPartners: [{ type: String, trim: true }]
    },

    // Export
    export: {
        exportsCurrently: { type: Boolean, default: false },
        exportCountries: [{ type: String, trim: true }],
        exportRevenuePercentage: { type: Number, default: 0 },
        willingToExport: { type: Boolean, default: false },
        exportReadinessLevel: { type: String, trim: true, default: '' }
    },

    // Digital & Technology
    digital: {
        technologyUsageLevel: { type: String, trim: true, default: '' },
        digitalPresenceLevel: { type: String, trim: true, default: '' },
        ecommerceEnabled: { type: Boolean, default: false }
    },

    // Business Needs
    needs: {
        hiringNeeds: { type: String, trim: true, default: '' },
        skillGaps: { type: String, trim: true, default: '' },
        keyChallenges: { type: String, trim: true, default: '' },  
        expansionPlans: { type: String, trim: true, default: '' }
    },

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

// Indexing for optimized search queries (accessed via $or regex)
industry50LPlusSchema.index({ 
    companyName: 1, 
    ownerCeoName: 1, 
    'address.city': 1, 
    businessCategory: 1 
});

// FIX: Removed pre('save') phone normalization hook.
// Phone cleaning (.replace(/\D/g,'').slice(-10)) is already applied in mapIndustry50LData in ingestion.controller.js

const Industry50LPlus = mongoose.model('Industry50LPlus', industry50LPlusSchema);
module.exports = Industry50LPlus;