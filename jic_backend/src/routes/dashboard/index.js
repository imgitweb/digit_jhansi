const express = require('express');
const router = express.Router();

router.use('/overview', require('./dashboardOverview.routes'));
router.use('/kpis-data', require('./kpisData.routes'));
router.use('/industry-distribution', require('./industryDistribution.routes'));
router.use('/business-growth', require('./businessGrowth.routes'));
router.use('/workforce-analytics', require('./workforceAnalytics.routes'));
router.use('/skill-gap-analysis', require('./skillGapAnalysis.routes'));
router.use('/digital-adoption', require('./digitalAdoption.routes'));
router.use('/export-analytics', require('./exportAnalytics.routes'));
router.use('/industry-health', require('./industryHealth.routes'));
router.use('/economic-map', require('./economicMap.routes'));
router.use('/infrastructure-stats', require('./infrastructureStats.routes'));

module.exports = router;  