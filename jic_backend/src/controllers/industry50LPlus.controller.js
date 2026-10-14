const Industry50LPlus = require('../models/industry50LPlus.model');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Get all industries (50L+) with pagination and advanced filtering
 * @route   GET /api/industries-50lplus
 */
const getIndustries50L = async (req, res, next) => {
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
                { ownerCeoName: searchRegex },  
                { 'address.city': searchRegex },
                { businessCategory: searchRegex },
                { phoneNumber: searchRegex }
            ];
        }

        // Advanced Filters
        if (req.query.city) query['address.city'] = { $regex: req.query.city, $options: 'i' };
        if (req.query.district) query['address.district'] = { $regex: req.query.district, $options: 'i' };
        if (req.query.businessCategory) query.businessCategory = { $regex: req.query.businessCategory, $options: 'i' };
        if (req.query.industryType) query.industryType = { $regex: req.query.industryType, $options: 'i' };
        if (req.query.status) query.status = req.query.status;
        if (req.query.ecommerceEnabled) query['digital.ecommerceEnabled'] = req.query.ecommerceEnabled === 'true';
        if (req.query.gstRegistered) query['compliance.gstRegistered'] = req.query.gstRegistered === 'true';
        if (req.query.exportsCurrently) query['export.exportsCurrently'] = req.query.exportsCurrently === 'true';

        const industries = await Industry50LPlus.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Industry50LPlus.countDocuments(query);

        const pagination = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };

        return sendResponse(res, 200, true, 'Industries (50L+) fetched successfully', industries, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single industry (50L+) by ID
 * @route   GET /api/industries-50lplus/:id
 */
const getIndustry50LById = async (req, res, next) => {
    try {
        const industry = await Industry50LPlus.findById(req.params.id);

        if (!industry) {
            res.status(404);
            throw new Error('Industry not found');
        }

        return sendResponse(res, 200, true, 'Industry fetched successfully', industry);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a single industry (50L+) manually
 * @route   POST /api/industries-50lplus
 */
const createIndustry50L = async (req, res, next) => {
    try {
        if (req.body.phoneNumber) {
            req.body.phoneNumber = String(req.body.phoneNumber).replace(/\D/g, '').slice(-10);
        }

        const industryExists = await Industry50LPlus.findOne({ phoneNumber: req.body.phoneNumber });

        if (industryExists) {
            res.status(400);
            throw new Error('An industry with this phone number already exists');
        }

        const data = { ...req.body, registrationSource: 'Manual Entry' };

        const industry = await Industry50LPlus.create(data);
        return sendResponse(res, 201, true, 'Industry created successfully', industry);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update an industry (50L+)
 * @route   PUT /api/industries-50lplus/:id
 */
const updateIndustry50L = async (req, res, next) => {
    try {
        if (req.body.phoneNumber) {
            req.body.phoneNumber = String(req.body.phoneNumber).replace(/\D/g, '').slice(-10);
            const conflict = await Industry50LPlus.findOne({ 
                phoneNumber: req.body.phoneNumber, 
                _id: { $ne: req.params.id } 
            });
            if (conflict) {
                res.status(400);
                throw new Error('Another industry with this phone number already exists');
            }
        }

        const industry = await Industry50LPlus.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!industry) {
            res.status(404);
            throw new Error('Industry not found');
        }

        return sendResponse(res, 200, true, 'Industry updated successfully', industry);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete an industry (50L+)
 * @route   DELETE /api/industries-50lplus/:id
 */
const deleteIndustry50L = async (req, res, next) => {
    try {
        const industry = await Industry50LPlus.findById(req.params.id);

        if (!industry) {
            res.status(404);
            throw new Error('Industry not found');
        }

        await industry.deleteOne();
        return sendResponse(res, 200, true, 'Industry deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getIndustries50L,
    getIndustry50LById,
    createIndustry50L,
    updateIndustry50L,
    deleteIndustry50L
};