const mongoose = require('mongoose');

const dashboardKPISchema = new mongoose.Schema({
    key: { 
        type: String, 
        required: true,
        enum: ['district_gdp', 'per_capita_income', 'total_population', 'employment_rate', 'total_industries', 'total_exports', 'registered_businesses', 'active_msmes', 'startup_count', 'industrial_growth', 'tax_revenue', 'exporters_count']
    },
    title: { type: String, required: true },
    value: { type: Number, required: true },
    prefix: { type: String, default: '' },
    suffix: { type: String, default: '' },
    growth: { type: Number, required: true },
    trend: { type: String, enum: ['up', 'down'], required: true },
    displayOrder: { type: Number, required: true },
    fiscalYear: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('DashboardKPI', dashboardKPISchema);  