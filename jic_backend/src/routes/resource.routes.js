const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getResources, 
    getResourceById,
    createResource, 
    updateResource,
    deleteResource 
} = require('../controllers/resource.controller');


router.route('/')
    .get(protect, getResources)
    .post(protect, createResource);

router.route('/:id')
    .get(protect, getResourceById)
    .put(protect, updateResource)
    .delete(protect, deleteResource);  

module.exports = router;