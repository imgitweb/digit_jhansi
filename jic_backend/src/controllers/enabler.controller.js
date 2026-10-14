const Enabler = require('../models/enabler.model');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Get all enablers with pagination and advanced filtering
 * @route   GET /api/enablers
 */
const getEnablers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = {};    

        // Full text search via Regex ($or)
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            query.$or = [
                { companyName: searchRegex },
                { ownerName: searchRegex },   
                { 'address.city': searchRegex },
                { 'serviceProfile.category': searchRegex },
                { contactNumber: searchRegex }
            ];
        }

        // Advanced Filters
        if (req.query.city) query['address.city'] = { $regex: req.query.city, $options: 'i' };
        if (req.query.district) query['address.district'] = { $regex: req.query.district, $options: 'i' };
        if (req.query.serviceCategory) query['serviceProfile.category'] = { $regex: req.query.serviceCategory, $options: 'i' };
        if (req.query.techCapabilityLevel) query['businessDetails.techCapabilityLevel'] = req.query.techCapabilityLevel;
        if (req.query.status) query.status = req.query.status;
        if (req.query.willingToOnboard) query.willingToOnboardLocalSellers = req.query.willingToOnboard === 'true';

        const enablers = await Enabler.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Enabler.countDocuments(query);

        const pagination = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };

        return sendResponse(res, 200, true, 'Enablers fetched successfully', enablers, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single enabler by ID
 * @route   GET /api/enablers/:id
 */
const getEnablerById = async (req, res, next) => {
    try {
        const enabler = await Enabler.findById(req.params.id);

        if (!enabler) {
            res.status(404);
            throw new Error('Enabler not found');
        }

        return sendResponse(res, 200, true, 'Enabler fetched successfully', enabler);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a single enabler manually
 * @route   POST /api/enablers
 */
const createEnabler = async (req, res, next) => {
    try {
        // Clean contact number before processing
        if (req.body.contactNumber) {
            req.body.contactNumber = String(req.body.contactNumber).replace(/\D/g, '').slice(-10);
        }

        const enablerExists = await Enabler.findOne({ contactNumber: req.body.contactNumber });

        if (enablerExists) {
            res.status(400);
            throw new Error('An enabler with this contact number already exists');
        }

        // Force manual entry flag
        const data = { ...req.body, registrationSource: 'Manual Entry' };

        const enabler = await Enabler.create(data);
        return sendResponse(res, 201, true, 'Enabler created successfully', enabler);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update an enabler
 * @route   PUT /api/enablers/:id
 */
const updateEnabler = async (req, res, next) => {
    try {
        if (req.body.contactNumber) {
            req.body.contactNumber = String(req.body.contactNumber).replace(/\D/g, '').slice(-10);
            const conflict = await Enabler.findOne({ 
                contactNumber: req.body.contactNumber, 
                _id: { $ne: req.params.id } 
            });
            if (conflict) {
                res.status(400);
                throw new Error('Another enabler with this contact number already exists');
            }
        }

        const enabler = await Enabler.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!enabler) {
            res.status(404);
            throw new Error('Enabler not found');
        }

        return sendResponse(res, 200, true, 'Enabler updated successfully', enabler);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete an enabler
 * @route   DELETE /api/enablers/:id
 */
const deleteEnabler = async (req, res, next) => {
    try {
        const enabler = await Enabler.findById(req.params.id);

        if (!enabler) {
            res.status(404);
            throw new Error('Enabler not found');
        }

        await enabler.deleteOne();
        return sendResponse(res, 200, true, 'Enabler deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEnablers,
    getEnablerById,
    createEnabler,
    updateEnabler,
    deleteEnabler
};