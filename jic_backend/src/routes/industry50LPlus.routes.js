const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getIndustries50L, 
    getIndustry50LById,
    createIndustry50L, 
    updateIndustry50L,
    deleteIndustry50L 
} = require('../controllers/industry50LPlus.controller');

router.route('/')
    .get(protect, getIndustries50L)
    .post(protect, createIndustry50L);

router.route('/:id')
    .get(protect, getIndustry50LById)
    .put(protect, updateIndustry50L)
    .delete(protect, deleteIndustry50L);

module.exports = router;  