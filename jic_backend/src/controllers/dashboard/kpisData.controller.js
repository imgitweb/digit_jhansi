const DashboardKPI = require('../../models/dashboard/dashboardKPI.model');
const sendResponse = require('../../utils/apiResponse');

exports.getPublished = async (req, res, next) => {
    try {
        const period = req.query.period || 'this_year';
        const data = await DashboardKPI.find({ period, status: 'published', isDeleted: false }).sort({ displayOrder: 1 });
        sendResponse(res, 200, true, 'KPIs fetched successfully', data);
    } catch (error) { next(error); }
};

exports.getAllAdmin = async (req, res, next) => {
    try {
        const data = await DashboardKPI.find({ isDeleted: false }).sort({ displayOrder: 1 });
        sendResponse(res, 200, true, 'All KPIs fetched successfully', data);
    } catch (error) { next(error); }
};
   
exports.createRecord = async (req, res, next) => {
    try {
        const doc = await DashboardKPI.create({ ...req.body, status: 'draft' });
        sendResponse(res, 201, true, 'KPI created', doc);
    } catch (error) { next(error); }
};

exports.createBulk = async (req, res, next) => {
    try {
        if (!Array.isArray(req.body)) return sendResponse(res, 400, false, 'Body must be an array');
        const docs = await DashboardKPI.insertMany(req.body.map(kpi => ({ ...kpi, status: 'draft' })));
        sendResponse(res, 201, true, 'Bulk KPIs created', docs);
    } catch (error) { next(error); }
};

exports.updateRecord = async (req, res, next) => {
    try {
        const doc = await DashboardKPI.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!doc) return sendResponse(res, 404, false, 'KPI not found');
        sendResponse(res, 200, true, 'KPI updated', doc);
    } catch (error) { next(error); }
};

exports.publishRecord = async (req, res, next) => {
    try {
        const doc = await DashboardKPI.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true });
        if (!doc) return sendResponse(res, 404, false, 'KPI not found');
        sendResponse(res, 200, true, 'KPI published', doc);
    } catch (error) { next(error); }
};

exports.unpublishRecord = async (req, res, next) => {
    try {
        const doc = await DashboardKPI.findByIdAndUpdate(req.params.id, { status: 'draft' }, { new: true });
        if (!doc) return sendResponse(res, 404, false, 'KPI not found');
        sendResponse(res, 200, true, 'KPI unpublished', doc);
    } catch (error) { next(error); }
};

exports.deleteRecord = async (req, res, next) => {
    try {
        const doc = await DashboardKPI.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!doc) return sendResponse(res, 404, false, 'KPI not found');
        sendResponse(res, 200, true, 'KPI soft deleted');
    } catch (error) { next(error); }
};