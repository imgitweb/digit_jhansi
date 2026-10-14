const Resource = require('../models/resource.model');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Get all resources with pagination and advanced filtering
 * @route   GET /api/resources
 */
const getResources = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = {};

        // Full text search
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            query.$or = [
                { fullName: searchRegex },
                { 'skills.primary.name': searchRegex },
                { 'address.block': searchRegex },
                { phoneNumber: searchRegex }
            ];
        }

        // Address Filters
        if (req.query.block) query['address.block'] = { $regex: req.query.block, $options: 'i' };
        if (req.query.district) query['address.district'] = { $regex: req.query.district, $options: 'i' };

        // Demographics & Employment
        if (req.query.gender) query.gender = req.query.gender;
        if (req.query.employmentStatus) query['employment.currentStatus'] = req.query.employmentStatus;
        if (req.query.primarySkill) query['skills.primary.name'] = { $regex: req.query.primarySkill, $options: 'i' };

        // Flags & Preferences
        if (req.query.willingToRelocate) query['flags.willingToRelocate'] = req.query.willingToRelocate === 'true';
        if (req.query.status) query.status = req.query.status;
        if (req.query.availability) query['workPreference.availability'] = { $regex: req.query.availability, $options: 'i' };
        if (req.query.digitalLiteracyLevel) query['digitalProfile.digitalLiteracyLevel'] = req.query.digitalLiteracyLevel;

        const resources = await Resource.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Resource.countDocuments(query);

        const pagination = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };

        return sendResponse(res, 200, true, 'Resources fetched successfully', resources, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single resource by ID
 * @route   GET /api/resources/:id
 */
const getResourceById = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            res.status(404);
            throw new Error('Resource not found');
        }

        return sendResponse(res, 200, true, 'Resource fetched successfully', resource);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a single resource manually
 * @route   POST /api/resources
 */
const createResource = async (req, res, next) => {
    try {
        // Clean phone number before processing
        if (req.body.phoneNumber) {
            req.body.phoneNumber = String(req.body.phoneNumber).replace(/\D/g, '').slice(-10);
        }

        const resourceExists = await Resource.findOne({ phoneNumber: req.body.phoneNumber });

        if (resourceExists) {
            res.status(400);
            throw new Error('A resource with this phone number already exists');
        }

        // Force manual entry flag  
        const data = { ...req.body, registrationSource: 'Manual Entry' };

        const resource = await Resource.create(data);
        return sendResponse(res, 201, true, 'Resource created successfully', resource);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a resource
 * @route   PUT /api/resources/:id
 */
const updateResource = async (req, res, next) => {
    try {
        if (req.body.phoneNumber) {
            req.body.phoneNumber = String(req.body.phoneNumber).replace(/\D/g, '').slice(-10);
            const conflict = await Resource.findOne({ 
                phoneNumber: req.body.phoneNumber, 
                _id: { $ne: req.params.id } 
            });
            if (conflict) {
                res.status(400);
                throw new Error('Another resource with this phone number already exists');
            }
        }

        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!resource) {
            res.status(404);
            throw new Error('Resource not found');
        }

        return sendResponse(res, 200, true, 'Resource updated successfully', resource);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a resource
 * @route   DELETE /api/resources/:id
 */
const deleteResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            res.status(404);
            throw new Error('Resource not found');
        }

        await resource.deleteOne();
        return sendResponse(res, 200, true, 'Resource deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource
};