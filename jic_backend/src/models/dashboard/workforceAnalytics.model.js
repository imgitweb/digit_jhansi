const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    color: { type: String, required: true },
    displayOrder: { type: Number, required: true }
});

const workforceAnalyticsSchema = new mongoose.Schema({
    fiscalYear: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false },
    workingPopulation: { type: Number, required: true },
    skilledWorkforce: { type: Number, required: true },
    unemploymentRate: { type: Number, required: true, min: 0, max: 100 },
    femaleWorkforce: { type: Number, required: true, min: 0, max: 100 },
    sectorDistribution: [sectorSchema]
}, { timestamps: true });
   
module.exports = mongoose.model('WorkforceAnalytics', workforceAnalyticsSchema);