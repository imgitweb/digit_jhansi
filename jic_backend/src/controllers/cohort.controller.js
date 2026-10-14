// src/controllers/cohort.controller.js
const Cohort = require('../models/cohort.model');
const Resource = require('../models/resource.model');
const mongoose = require('mongoose');

const createCohort = async (req, res) => {
  try {
    const { name, category, primarySkill, startDate, endDate, memberIds, mentor, description } = req.body;

    if (!name || !category || !primarySkill || !startDate || !endDate || !mentor) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, category, primarySkill, startDate, endDate, and mentor are required.',
        data: null
      });
    }

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one resource must be selected to create a cohort',
        data: null
      });
    }

    const uniqueMemberIds = [...new Set(memberIds)];
    const validResourcesCount = await Resource.countDocuments({ _id: { $in: uniqueMemberIds } });
    
    if (validResourcesCount !== uniqueMemberIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some selected resources were not found',
        data: null
      });
    }

    const cohortId = 'COH-' + Date.now();

    const newCohort = new Cohort({
      cohortId,
      name,
      category,
      primarySkill,
      startDate,
      endDate,
      mentor,
      description,
      members: uniqueMemberIds
    });

    await newCohort.save();

    const populatedCohort = await Cohort.findById(newCohort._id).populate({
      path: 'members',
      select: 'fullName phoneNumber skills.primary.name address.block status'
    });

    return res.status(201).json({
      success: true,
      message: 'Cohort created successfully',
      data: populatedCohort
    });
  } catch (error) {
    console.error("COHORT CREATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating cohort',
      data: null
    });
  }
};

const getAllCohorts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const total = await Cohort.countDocuments(filter);
    const cohorts = await Cohort.find(filter)
      .select('-members')
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      message: 'Cohorts retrieved successfully',
      data: cohorts,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching cohorts',
      data: null
    });
  }
};

const getCohortById = async (req, res) => {
  try {
    const { id } = req.params;

    const cohort = await Cohort.findById(id).populate({
      path: 'members',
      select: 'fullName phoneNumber email gender age status skills.primary skills.secondary address.block address.village employment.currentStatus workPreference.availability flags.willingForTraining interests'
    });

    if (!cohort) {
      return res.status(404).json({
        success: false,
        message: 'Cohort not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cohort retrieved successfully',
      data: cohort
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching cohort details',
      data: null
    });
  }
};

const updateCohort = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ['name', 'category', 'primarySkill', 'description', 'startDate', 'endDate', 'mentor', 'status'];
    const updateData = {};

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const updatedCohort = await Cohort.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCohort) {
      return res.status(404).json({
        success: false,
        message: 'Cohort not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cohort updated successfully',
      data: updatedCohort
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating cohort',
      data: null
    });
  }
};

const addMembersToCohort = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberIds } = req.body;

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid non-empty array of memberIds is required',
        data: null
      });
    }

    const cohort = await Cohort.findById(id);
    if (!cohort) {   
      return res.status(404).json({
        success: false,
        message: 'Cohort not found',
        data: null
      });
    }

    const uniqueMemberIds = [...new Set(memberIds)];   
    const validResourcesCount = await Resource.countDocuments({ _id: { $in: uniqueMemberIds } });
    
    if (validResourcesCount !== uniqueMemberIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some selected resources were not found',
        data: null
      });
    }

    const updatedCohort = await Cohort.findByIdAndUpdate(
      id,
      { $addToSet: { members: { $each: uniqueMemberIds } } },
      { new: true }
    );

    // Update totalMembers after push to ensure sync
    updatedCohort.totalMembers = updatedCohort.members.length;
    await updatedCohort.save();

    return res.status(200).json({
      success: true,
      message: 'Members added successfully',
      data: updatedCohort
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error while adding members',
      data: null
    });
  }
};

const removeMemberFromCohort = async (req, res) => {
  try {
    const { id, resourceId } = req.params;

    const cohort = await Cohort.findById(id);
    if (!cohort) {
      return res.status(404).json({
        success: false,
        message: 'Cohort not found',
        data: null
      });
    }

    await Cohort.findByIdAndUpdate(
      id,
      {
        $pull: { members: resourceId },
        $inc: { totalMembers: -1 }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error while removing member',
      data: null
    });
  }
};

const deleteCohort = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCohort = await Cohort.findByIdAndDelete(id);

    if (!deletedCohort) {
      return res.status(404).json({
        success: false,
        message: 'Cohort not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cohort deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting cohort',
      data: null
    });
  }
};

const getCohortStats = async (req, res) => {
  try {
    const statsResult = await Cohort.aggregate([
      {
        $facet: {
          totalCohorts: [{ $count: 'count' }],
          statuses: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          totalResourcesAssigned: [
            { $unwind: '$members' },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const facetData = statsResult[0];

    const getCountForStatus = (statusName) => {
      const statusObj = facetData.statuses.find(s => s._id === statusName);
      return statusObj ? statusObj.count : 0;
    };

    const stats = {
      totalCohorts: facetData.totalCohorts[0] ? facetData.totalCohorts[0].count : 0,
      activeCohorts: getCountForStatus('Active'),
      plannedCohorts: getCountForStatus('Planned'),
      completedCohorts: getCountForStatus('Completed'),
      totalResourcesAssigned: facetData.totalResourcesAssigned[0] ? facetData.totalResourcesAssigned[0].count : 0
    };

    return res.status(200).json({
      success: true,
      message: 'Cohort stats retrieved successfully',
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching stats',
      data: null
    });
  }
};

module.exports = {
  createCohort,
  getAllCohorts,
  getCohortById,
  updateCohort,
  addMembersToCohort,
  removeMemberFromCohort,
  deleteCohort,
  getCohortStats
};