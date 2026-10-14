const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getInstitutions, 
    getInstitutionById, 
    createInstitution, 
    updateInstitution,
    deleteInstitution 
} = require('../controllers/institution.controller');

router.route('/')
    .get(protect, getInstitutions)
    .post(protect, createInstitution);

router.route('/:id')
    .get(protect, getInstitutionById)
    .put(protect, updateInstitution)
    .delete(protect, deleteInstitution);  

module.exports = router;