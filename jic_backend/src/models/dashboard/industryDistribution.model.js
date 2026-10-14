const mongoose = require('mongoose');

const industryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    pct: { type: String, required: true },
    color: { type: String, required: true },
    displayOrder: { type: Number, required: true }
});

const industryDistributionSchema = new mongoose.Schema({
    fiscalYear: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false },
    industries: [industryItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('IndustryDistribution', industryDistributionSchema);   