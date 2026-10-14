const mongoose = require('mongoose');

const monthDataSchema = new mongoose.Schema({
    month: { type: String, required: true, enum: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'] },
    newReg: { type: Number, required: true },
    active: { type: Number, required: true },
    monthOrder: { type: Number, required: true }
});

const businessGrowthSchema = new mongoose.Schema({
    fiscalYear: { type: String, required: true },
    period: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    isDeleted: { type: Boolean, default: false },
    monthlyData: [monthDataSchema]
}, { timestamps: true });

module.exports = mongoose.model('BusinessGrowth', businessGrowthSchema);  