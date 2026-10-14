const Rider = require('../models/rider.model');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Get all riders with pagination and advanced filtering
 * @route   GET /api/riders
 */
const getRiders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = {};

        // Full text search via Regex ($or)
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            query.$or = [
                { fullName: searchRegex },
                { city: searchRegex },
                { areaLocality: searchRegex },
                { 'platform.primary': searchRegex },
                { phoneNumber: searchRegex }
            ];
        }

        // Advanced Filters
        if (req.query.city) query.city = { $regex: req.query.city, $options: 'i' };
        if (req.query.gender) query.gender = req.query.gender;
        if (req.query.vehicleType) query['vehicle.type'] = req.query.vehicleType;
        if (req.query.employmentType) query['employment.type'] = req.query.employmentType;
        if (req.query.status) query.status = req.query.status;
        if (req.query.appUsageLevel) query['digital.appUsageLevel'] = req.query.appUsageLevel;
        if (req.query.willingForEcommerce) query['delivery.willingForEcommerce'] = req.query.willingForEcommerce === 'true';

        const riders = await Rider.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Rider.countDocuments(query);

        const pagination = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };

        return sendResponse(res, 200, true, 'Riders fetched successfully', riders, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single rider by ID
 * @route   GET /api/riders/:id
 */
const getRiderById = async (req, res, next) => {
    try {
        const rider = await Rider.findById(req.params.id);

        if (!rider) {
            res.status(404);
            throw new Error('Rider not found');
        }

        return sendResponse(res, 200, true, 'Rider fetched successfully', rider);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a single rider manually
 * @route   POST /api/riders
 */
const createRider = async (req, res, next) => {
    try {
        // Clean phone number before processing to avoid pre-save hook crashes
        if (req.body.phoneNumber) {
            req.body.phoneNumber = String(req.body.phoneNumber).replace(/\D/g, '').slice(-10);
        }

        const riderExists = await Rider.findOne({ phoneNumber: req.body.phoneNumber });

        if (riderExists) {
            res.status(400);
            throw new Error('A rider with this phone number already exists');
        }

        // Force manual entry flag
        const data = { ...req.body, registrationSource: 'Manual Entry' };

        const rider = await Rider.create(data);
        return sendResponse(res, 201, true, 'Rider created successfully', rider);
    } catch (error) {
        next(error);   
    }
};

/**
 * @desc    Update a rider
 * @route   PUT /api/riders/:id
 */
const updateRider = async (req, res, next) => {
    try {
        if (req.body.phoneNumber) {
            req.body.phoneNumber = String(req.body.phoneNumber).replace(/\D/g, '').slice(-10);
            const conflict = await Rider.findOne({ 
                phoneNumber: req.body.phoneNumber, 
                _id: { $ne: req.params.id } 
            });
            if (conflict) {
                res.status(400);
                throw new Error('Another rider with this phone number already exists');
            }
        }

        const rider = await Rider.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!rider) {
            res.status(404);
            throw new Error('Rider not found');
        }

        return sendResponse(res, 200, true, 'Rider updated successfully', rider);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a rider
 * @route   DELETE /api/riders/:id
 */
const deleteRider = async (req, res, next) => {
    try {
        const rider = await Rider.findById(req.params.id);

        if (!rider) {
            res.status(404);
            throw new Error('Rider not found');
        }

        await rider.deleteOne();
        return sendResponse(res, 200, true, 'Rider deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRiders,
    getResourceById: getRiderById, // Exported correctly for routes
    createRider,
    updateRider,
    deleteRider
};