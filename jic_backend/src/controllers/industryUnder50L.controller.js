const IndustryUnder50L = require('../models/industryUnder50L.model');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Get all industries (Under 50L) with pagination and advanced filtering
 * @route   GET /api/industries-under50l
 */
const getIndustries = async (req, res, next) => {
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
                { 'address.block': searchRegex },
                { businessCategory: searchRegex },
                { phoneNumber: searchRegex }
            ];
        }

        // Advanced Filters
        if (req.query.block) query['address.block'] = { $regex: req.query.block, $options: 'i' };
        if (req.query.district) query['address.district'] = { $regex: req.query.district, $options: 'i' };
        if (req.query.businessCategory) query.businessCategory = { $regex: req.query.businessCategory, $options: 'i' };
        if (req.query.industryType) query.industryType = { $regex: req.query.industryType, $options: 'i' };
        if (req.query.status) query.status = req.query.status;
        if (req.query.openToEcommerce) query['growth.openToEcommerce'] = req.query.openToEcommerce === 'true';
        if (req.query.gstRegistered) query['compliance.gstRegistered'] = req.query.gstRegistered === 'true';

        const industries = await IndustryUnder50L.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await IndustryUnder50L.countDocuments(query);

        const pagination = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };

        return sendResponse(res, 200, true, 'Industries fetched successfully', industries, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single industry by ID
 * @route   GET /api/industries-under50l/:id
 */
const getIndustryById = async (req, res, next) => {
    try {
        const industry = await IndustryUnder50L.findById(req.params.id);

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
 * @desc    Create a single industry manually
 * @route   POST /api/industries-under50l
 */
const createIndustry = async (req, res, next) => {
    try {
        if (req.body.phoneNumber) {
            req.body.phoneNumber = String(req.body.phoneNumber).replace(/\D/g, '').slice(-10);
        }

        const industryExists = await IndustryUnder50L.findOne({ phoneNumber: req.body.phoneNumber });

        if (industryExists) {
            res.status(400);
            throw new Error('An industry with this phone number already exists');
        }

        const data = { ...req.body, registrationSource: 'Manual Entry' };

        const industry = await IndustryUnder50L.create(data);
        return sendResponse(res, 201, true, 'Industry created successfully', industry);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update an industry
 * @route   PUT /api/industries-under50l/:id
 */
const updateIndustry = async (req, res, next) => {
    try {
        if (req.body.phoneNumber) {
            req.body.phoneNumber = String(req.body.phoneNumber).replace(/\D/g, '').slice(-10);
            const conflict = await IndustryUnder50L.findOne({ 
                phoneNumber: req.body.phoneNumber, 
                _id: { $ne: req.params.id } 
            });
            if (conflict) {
                res.status(400);
                throw new Error('Another industry with this phone number already exists');
            }
        }

        const industry = await IndustryUnder50L.findByIdAndUpdate(
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
 * @desc    Delete an industry
 * @route   DELETE /api/industries-under50l/:id
 */
const deleteIndustry = async (req, res, next) => {
    try {
        const industry = await IndustryUnder50L.findById(req.params.id);

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
    getIndustries,
    getIndustryById,
    createIndustry,
    updateIndustry,
    deleteIndustry
};