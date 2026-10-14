const mongoose = require('mongoose');

const exportProductSchema = new mongoose.Schema({
    product: { type: String, required: true },
    value: { type: Number, required: true },
    pct: { type: String, required: true },
    displayOrder: { type: Number, required: true }
});

const exportDestinationSchema = new mongoose.Schema({
    country: { type: String, required: true },
    flag: { type: String, required: true },
    pct: { type: Number, required: true },
    displayOrder: { type: Number, required: true }
});

const exportAnalyticsSchema = new mongoose.Schema({
    fiscalYear: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false },
    totalExport: { type: Number, required: true },
    exportingUnits: { type: Number, required: true },
    countriesExported: { type: Number, required: true },
    products: [exportProductSchema],
    destinations: [exportDestinationSchema]   
}, { timestamps: true });

module.exports = mongoose.model('ExportAnalytics', exportAnalyticsSchema);