const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getRiders, 
    getResourceById, // Exported from controller as this for ease
    createRider, 
    updateRider,
    deleteRider 
} = require('../controllers/rider.controller');

router.route('/')
    .get(protect, getRiders)
    .post(protect, createRider);

router.route('/:id')
    .get(protect, getResourceById)
    .put(protect, updateRider)
    .delete(protect, deleteRider);  

module.exports = router;