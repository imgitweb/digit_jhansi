const mongoose = require('mongoose');

const adoptionItemSchema = new mongoose.Schema({
    label: { type: String, required: true },
    pct: { type: Number, required: true },
    color: { type: String, required: true },
    displayOrder: { type: Number, required: true }
});

const digitalAdoptionSchema = new mongoose.Schema({
    fiscalYear: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false },
    metrics: [adoptionItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('DigitalAdoption', digitalAdoptionSchema);  