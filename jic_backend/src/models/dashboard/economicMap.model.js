const mongoose = require('mongoose');

const mapPointSchema = new mongoose.Schema({
    label: { type: String, required: true },
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
    category: { 
        type: String, 
        required: true,
        enum: ['Industrial Cluster', 'Mining Area', 'MSME Unit', 'Education Institute', 'Skill Center', 'Warehouse', 'High Unemployment Zone']
    },
    color: { type: String, required: true },
    description: { type: String, default: '' },
    displayOrder: { type: Number, required: true }
});

const economicMapSchema = new mongoose.Schema({
    fiscalYear: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false },
    points: [mapPointSchema]
}, { timestamps: true });

module.exports = mongoose.model('EconomicMap', economicMapSchema);  