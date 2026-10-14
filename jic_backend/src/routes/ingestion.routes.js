const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const { 
    uploadResourceExcel, 
    uploadRiderExcel,
    uploadEnablerExcel,
    uploadIndustryExcel,
    uploadIndustry50LExcel, // NEW Module
    uploadInstitutionExcel
} = require('../controllers/ingestion.controller');

// POST /api/ingestion/resources
router.post('/resources', protect, upload.single('excelFile'), uploadResourceExcel);

// POST /api/ingestion/riders
router.post('/riders', protect, upload.single('excelFile'), uploadRiderExcel);

// POST /api/ingestion/enablers
router.post('/enablers', protect, upload.single('excelFile'), uploadEnablerExcel);

// POST /api/ingestion/industries-under50l
router.post('/industries-under50l', protect, upload.single('excelFile'), uploadIndustryExcel);   

// POST /api/ingestion/industries-50lplus
router.post('/industries-50lplus', protect, upload.single('excelFile'), uploadIndustry50LExcel);

// POST /api/ingestion/institutions
router.post('/institutions', protect, upload.single('excelFile'), uploadInstitutionExcel);

module.exports = router;