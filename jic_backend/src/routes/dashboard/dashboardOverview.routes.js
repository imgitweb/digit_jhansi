const express = require('express');
const router = express.Router();
const { getOverview } = require('../../controllers/dashboard/dashboardOverview.controller');

router.get('/', getOverview);

module.exports = router;
  