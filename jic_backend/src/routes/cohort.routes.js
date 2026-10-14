// src/routes/cohort.routes.js
const express = require('express');
const router = express.Router();
const {
  createCohort,
  getAllCohorts,
  getCohortById,
  updateCohort,
  addMembersToCohort,
  removeMemberFromCohort,
  deleteCohort,
  getCohortStats
} = require('../controllers/cohort.controller');

// CRITICAL: Mount /stats before /:id routes to avoid param collision
router.get('/stats', getCohortStats);
  
router.get('/', getAllCohorts);
router.post('/', createCohort);

router.get('/:id', getCohortById);
router.put('/:id', updateCohort);
router.delete('/:id', deleteCohort);

router.post('/:id/members', addMembersToCohort);
router.delete('/:id/members/:resourceId', removeMemberFromCohort);

module.exports = router;