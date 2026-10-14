const mongoose = require('mongoose');

const industryHealthItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    color: { type: String, required: true },
    trend: { 
        type: [Number], 
        required: true,
        validate: [arr => arr.length === 15, 'Trend must contain exactly 15 numbers']
    },
    displayOrder: { type: Number, required: true }
});

const industryHealthSchema = new mongoose.Schema({
    fiscalYear: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false },
    industries: [industryHealthItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('IndustryHealth', industryHealthSchema);  