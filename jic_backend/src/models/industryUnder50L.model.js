// IMPORTANT — ONE-TIME MIGRATION: After deploying, run in MongoDB shell:
// db.industryunder50ls.dropIndex("phoneNumber_1")
// This removes the old unique phone index that was blocking duplicate phone numbers.

const mongoose = require('mongoose');

const industryUnder50LSchema = new mongoose.Schema({
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
        default: '' // FIX: Removed required validator — no row should be rejected for missing company name
    },
    ownerName: {
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
    shortCompanyBio: {
        type: String,
        trim: true,
        default: ''
    },
    yearEstablished: {
        type: Number,
        default: null
    },
    
    // Contact
    phoneNumber: {
        type: String,
        trim: true,
        default: '' // FIX: Removed required, unique, sparse, match — phone validation is controller-only for reporting
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: '' // FIX: Removed email format validator — controller handles reporting of invalid emails
    },

    // Location
    address: {
        fullAddress: { type: String, trim: true, default: '' },
        village: { type: String, trim: true, default: '' },
        block: { type: String, trim: true, default: '' },
        district: { type: String, trim: true, default: '' },
        state: { type: String, trim: true, default: '' }
    },

    // Registration & Compliance
    compliance: {
        msmeRegistered: { type: Boolean, default: false },
        typeOfCompanyRegistration: { type: String, trim: true, default: '' },
        gstRegistered: { type: Boolean, default: false }
    },

    // Business Scale
    scale: {
        lastYearTurnover: { type: String, default: 0 },
        numberOfEmployees: { type: String, default: 0 }
    },

    // Digital Presence
    digitalPresence: {
        hasWebsite: { type: Boolean, default: false },
        websiteUrl: { type: String, trim: true, default: '' },
        googleMyBusinessListed: { type: Boolean, default: false },
        socialMediaPresence: { type: String, trim: true, default: '' },
        whatsappBusinessSetup: { type: Boolean, default: false }
    },

    // Online Business
    onlineBusiness: {
        onlineSelling: { type: Boolean, default: false },
        platformsUsed: [{ type: String, trim: true }]
    },

    // Products & Market
    products: {
        primary: { type: String, trim: true, default: '' },
        secondary: { type: String, trim: true, default: '' },
        targetCustomers: { type: String, trim: true, default: '' }
    },

    // Business Needs
    needs: {
        keyChallenges: { type: String, trim: true, default: '' },
        hiringNeeds: { type: String, trim: true, default: '' },
        digitalSupportNeeded: { type: String, trim: true, default: '' }
    },

    // Export & Growth
    growth: {
        doesExport: { type: Boolean, default: false },
        willingToExport: { type: Boolean, default: false },
        openToEcommerce: { type: Boolean, default: false }
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

// Indexing for search optimization (used via $or regex)
industryUnder50LSchema.index({ 
    companyName: 'text', 
    ownerName: 'text', 
    'address.block': 'text', 
    businessCategory: 'text' 
});

const IndustryUnder50L = mongoose.model('IndustryUnder50L', industryUnder50LSchema);
module.exports = IndustryUnder50L;  