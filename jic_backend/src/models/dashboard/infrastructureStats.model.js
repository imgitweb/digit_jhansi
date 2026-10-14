const mongoose = require('mongoose');

const statItemSchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
    displayOrder: { type: Number, required: true }
});

const infrastructureStatsSchema = new mongoose.Schema({
    fiscalYear: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false },
    stats: [statItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('InfrastructureStats', infrastructureStatsSchema);  