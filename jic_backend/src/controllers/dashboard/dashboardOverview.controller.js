const sendResponse = require('../../utils/apiResponse');
const Models = {
    kpis: require('../../models/dashboard/dashboardKPI.model'),
    industryDistribution: require('../../models/dashboard/industryDistribution.model'),
    businessGrowth: require('../../models/dashboard/businessGrowth.model'),
    workforce: require('../../models/dashboard/workforceAnalytics.model'),
    skillGap: require('../../models/dashboard/skillGapAnalysis.model'),
    digitalAdoption: require('../../models/dashboard/digitalAdoption.model'),
    exportAnalytics: require('../../models/dashboard/exportAnalytics.model'),
    industryHealth: require('../../models/dashboard/industryHealth.model'),
    economicMap: require('../../models/dashboard/economicMap.model'),
    infrastructureStats: require('../../models/dashboard/infrastructureStats.model')
};
  
exports.getOverview = async (req, res, next) => {
    try {
        const period = req.query.period || 'this_year';
        const filter = { period, status: 'published', isDeleted: false };

        const [kpis, indDist, busGrowth, workforce, skillGap, digAdoption, expAnalyt, indHealth, ecoMap, infStats] = await Promise.all([
            Models.kpis.find(filter).sort({ displayOrder: 1 }),
            Models.industryDistribution.findOne(filter),
            Models.businessGrowth.findOne(filter),
            Models.workforce.findOne(filter),
            Models.skillGap.findOne(filter),
            Models.digitalAdoption.findOne(filter),
            Models.exportAnalytics.findOne(filter),
            Models.industryHealth.findOne(filter),
            Models.economicMap.findOne(filter),
            Models.infrastructureStats.findOne(filter)
        ]);

        const data = {
            kpis,
            industryDistribution: indDist,
            businessGrowth: busGrowth,
            workforce,
            skillGap,
            digitalAdoption: digAdoption,
            exportAnalytics: expAnalyt,
            industryHealth: indHealth,
            economicMap: ecoMap,
            infrastructureStats: infStats
        };

        sendResponse(res, 200, true, 'Dashboard overview fetched successfully', data);
    } catch (error) {
        next(error);
    }
};