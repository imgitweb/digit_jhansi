// IMPORTANT — ONE-TIME MIGRATION: After deploying, run in MongoDB shell:
// db.riders.dropIndex("phoneNumber_1")
// This removes the old unique phone constraint that was blocking duplicate phone numbers during Excel ingestion.

const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
    riderId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true,
        default: '' // FIX: Removed required validator — no row should be rejected for missing name
    },
    age: {
        type: Number,
        default: null // FIX: Removed min:16 max:80 validators — no row should be rejected for age range
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: ''
    },
    phoneNumber: {
        type: String,
        trim: true,
        default: '' // FIX: Removed required, unique, sparse, match — phone validation is controller-only for reporting
    },
    city: {
        type: String,
        trim: true,
        default: ''
    },
    areaLocality: {
        type: String,
        trim: true,
        default: ''
    },
    platform: {
        primary: { type: String, trim: true, default: '' },
        others: [{ type: String, trim: true }]
    },
    employment: {
        type: { 
            type: String, 
            enum: ['Full-time', 'Part-time', 'Freelance', 'Contract', ''], 
            default: '' 
        }
    },
    vehicle: {
        type: { 
            type: String, 
            enum: ['Bicycle', 'Motorcycle', 'Auto', 'Car', 'Van', 'Truck', 'E-Bike', ''], 
            default: '' 
        },
        ownsVehicle: { type: Boolean, default: false },
        details: { type: String, trim: true, default: '' },
        drivingLicense: { type: Boolean, default: false }
    },
    workSchedule: {
        hoursPerDay: { type: Number, default: 0 },
        daysPerWeek: { type: Number, default: 0 },
        preferredShift: { 
            type: String, 
            enum: ['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible', ''], 
            default: '' 
        }
    },
    earnings: {
        averageMonthly: { type: String, default: 0 },
        peakMonth: { type: String, trim: true, default: '' },
        fuelCostMonthly: { type: String, default: 0 },
        maintenanceCostMonthly: { type: String, default: 0 },
        netSavingsEstimate: { type: String, default: 0 }
    },
    experience: {
        years: { type: Number, default: 0 },
        orderType: { type: String, trim: true, default: '' },
        dailyOrdersAvg: { type: Number, default: 0 },
        serviceAreaCovered: { type: String, trim: true, default: '' }
    },
    delivery: {
        willingForLocal: { type: Boolean, default: false },
        willingForEcommerce: { type: Boolean, default: false }
    },
    digital: {
        smartphoneAvailable: { type: Boolean, default: false },
        internetAccess: { type: Boolean, default: false },
        appUsageLevel: { 
            type: String, 
            enum: ['None', 'Basic', 'Intermediate', 'Advanced', ''], 
            default: '' 
        }
    },
    financial: {
        bankAccount: { type: Boolean, default: false },
        upiAvailable: { type: Boolean, default: false }
    },
    safety: {
        insuranceCover: { type: Boolean, default: false },
        accidentHistory: { type: Boolean, default: false }
    },
    growth: {
        interestInFulltimeJob: { type: Boolean, default: false },
        interestInSkillTraining: { type: Boolean, default: false }
    },
    challengesFaced: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    registrationSource: {
        type: String,
        enum: ['Excel Upload', 'Manual Entry'],
        default: 'Manual Entry'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active'
    }
}, {
    timestamps: true
});

// Text indexing as requested (Search is handled via $or regex in controller)
riderSchema.index({ fullName: 'text', city: 'text', areaLocality: 'text', 'platform.primary': 'text' });

const Rider = mongoose.model('Rider', riderSchema);
module.exports = Rider;  