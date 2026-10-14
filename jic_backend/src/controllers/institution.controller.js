const Institution = require('../models/institution.model');
const sendResponse = require('../utils/apiResponse');
const { randomUUID } = require('crypto');

const getInstitutions = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = {};

        // Full text search via Regex ($or)
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            query.$or = [
                { institutionName: searchRegex },
                { address: searchRegex },
                { institutionType: searchRegex },
                { affiliation: searchRegex },
                { phone: searchRegex }
            ];
        }

        // Advanced Filters
        if (req.query.institutionType) query.institutionType = { $regex: req.query.institutionType, $options: 'i' };
        if (req.query.affiliation) query.affiliation = { $regex: req.query.affiliation, $options: 'i' };
        if (req.query.status) query.status = req.query.status;

        const institutions = await Institution.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Institution.countDocuments(query);

        const pagination = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };

        return sendResponse(res, 200, true, 'Institutions fetched successfully', institutions, pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single institution by ID
 * @route   GET /api/institutions/:id
 */
const getInstitutionById = async (req, res, next) => {
    try {
        const institution = await Institution.findById(req.params.id);

        if (!institution) {
            res.status(404);
            throw new Error('Institution not found');
        }

        return sendResponse(res, 200, true, 'Institution fetched successfully', institution);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a single institution manually
 * @route   POST /api/institutions
 */
const createInstitution = async (req, res, next) => {
    try {
        const institutionName = req.body.institutionName?.trim() || '';
        const address = req.body.address?.trim() || '';

        // Check for duplicates strictly based on exact Name AND Address match
        if (institutionName !== '' && address !== '') {
            const institutionExists = await Institution.findOne({ institutionName, address });

            if (institutionExists) {
                res.status(400);
                throw new Error('An institution with this name and address already exists');
            }
        }

        // Force manual entry flag and ensure unique sparse ID
        const data = { 
            ...req.body, 
            registrationSource: 'Manual Entry',
            institutionId: req.body.institutionId || `INST-${randomUUID()}`
        };

        const institution = await Institution.create(data);
        return sendResponse(res, 201, true, 'Institution created successfully', institution);
    } catch (error) {
        next(error);   
    }
};

/**
 * @desc    Update an institution
 * @route   PUT /api/institutions/:id
 */
const updateInstitution = async (req, res, next) => {
    try {
        const institution = await Institution.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!institution) {
            res.status(404);
            throw new Error('Institution not found');
        }

        return sendResponse(res, 200, true, 'Institution updated successfully', institution);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete an institution
 * @route   DELETE /api/institutions/:id
 */
const deleteInstitution = async (req, res, next) => {
    try {
        const institution = await Institution.findById(req.params.id);

        if (!institution) {
            res.status(404);
            throw new Error('Institution not found');
        }

        await institution.deleteOne();
        return sendResponse(res, 200, true, 'Institution deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getInstitutions,
    getInstitutionById,
    createInstitution,
    updateInstitution,
    deleteInstitution
};