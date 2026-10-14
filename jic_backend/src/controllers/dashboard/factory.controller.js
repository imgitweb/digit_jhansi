const sendResponse = require('../../utils/apiResponse');

exports.createDashboardController = (Model) => {
    return {
        getPublished: async (req, res, next) => {
            try {
                const period = req.query.period || 'this_year';
                const data = await Model.findOne({ period, status: 'published', isDeleted: false });
                sendResponse(res, 200, true, 'Data fetched successfully', data);
            } catch (error) { next(error); }
        },
        getAllAdmin: async (req, res, next) => {   
            try {
                const data = await Model.find({ isDeleted: false }).sort({ createdAt: -1 });
                sendResponse(res, 200, true, 'All data fetched successfully', data);
            } catch (error) { next(error); }
        },
        createRecord: async (req, res, next) => {
            try {
                const doc = await Model.create({ ...req.body, status: 'draft' });
                sendResponse(res, 201, true, 'Record created as draft', doc);
            } catch (error) { next(error); }
        },
        updateRecord: async (req, res, next) => {
            try {
                const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
                if (!doc) return sendResponse(res, 404, false, 'Record not found');
                sendResponse(res, 200, true, 'Record updated successfully', doc);
            } catch (error) { next(error); }
        },
        publishRecord: async (req, res, next) => {
            try {
                const doc = await Model.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true });
                if (!doc) return sendResponse(res, 404, false, 'Record not found');
                sendResponse(res, 200, true, 'Record published', doc);
            } catch (error) { next(error); }
        },
        unpublishRecord: async (req, res, next) => {
            try {
                const doc = await Model.findByIdAndUpdate(req.params.id, { status: 'draft' }, { new: true });
                if (!doc) return sendResponse(res, 404, false, 'Record not found');
                sendResponse(res, 200, true, 'Record unpublished', doc);
            } catch (error) { next(error); }
        },
        deleteRecord: async (req, res, next) => {
            try {
                const doc = await Model.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
                if (!doc) return sendResponse(res, 404, false, 'Record not found');
                sendResponse(res, 200, true, 'Record deleted successfully');
            } catch (error) { next(error); }
        }
    };
};