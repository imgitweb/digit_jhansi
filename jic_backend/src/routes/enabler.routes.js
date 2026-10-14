const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getEnablers, 
    getEnablerById,
    createEnabler, 
    updateEnabler,
    deleteEnabler 
} = require('../controllers/enabler.controller');

router.route('/')
    .get(protect, getEnablers)
    .post(protect, createEnabler);

router.route('/:id')
    .get(protect, getEnablerById)
    .put(protect, updateEnabler)
    .delete(protect, deleteEnabler);

module.exports = router;  