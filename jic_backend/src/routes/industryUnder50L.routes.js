const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getIndustries, 
    getIndustryById,
    createIndustry, 
    updateIndustry,
    deleteIndustry 
} = require('../controllers/industryUnder50L.controller');

router.route('/')
    .get(protect, getIndustries)
    .post(protect, createIndustry);

router.route('/:id')
    .get(protect, getIndustryById)
    .put(protect, updateIndustry)
    .delete(protect, deleteIndustry);

module.exports = router;  