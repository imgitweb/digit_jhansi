const mongoose = require('mongoose');

const skillItemSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    demand: { type: Number, required: true },
    available: { type: Number, required: true },
    displayOrder: { type: Number, required: true }
});

const skillGapAnalysisSchema = new mongoose.Schema({
    fiscalYear: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false },
    skills: [skillItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('SkillGapAnalysis', skillGapAnalysisSchema);   