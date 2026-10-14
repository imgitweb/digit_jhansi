require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Models
const DashboardKPI = require('../models/dashboard/dashboardKPI.model');
const IndustryDistribution = require('../models/dashboard/industryDistribution.model');
const BusinessGrowth = require('../models/dashboard/businessGrowth.model');
const WorkforceAnalytics = require('../models/dashboard/workforceAnalytics.model');
const SkillGapAnalysis = require('../models/dashboard/skillGapAnalysis.model');
const DigitalAdoption = require('../models/dashboard/digitalAdoption.model');
const ExportAnalytics = require('../models/dashboard/exportAnalytics.model');
const IndustryHealth = require('../models/dashboard/industryHealth.model');
const EconomicMap = require('../models/dashboard/economicMap.model');
const InfrastructureStats = require('../models/dashboard/infrastructureStats.model');

const defaultMeta = { fiscalYear: '2024-25', period: 'this_year', status: 'published' };

const seedData = async () => {
    try {
        await connectDB();
        console.log('Database Connected. Clearing existing dashboard data...');

        await Promise.all([
            DashboardKPI.deleteMany({}), IndustryDistribution.deleteMany({}),
            BusinessGrowth.deleteMany({}), WorkforceAnalytics.deleteMany({}),
            SkillGapAnalysis.deleteMany({}), DigitalAdoption.deleteMany({}),
            ExportAnalytics.deleteMany({}), IndustryHealth.deleteMany({}),
            EconomicMap.deleteMany({}), InfrastructureStats.deleteMany({})
        ]);

        console.log('Seeding new data...');  

        // 1. KPIs
        const kpis = [
            { key: 'district_gdp', title: 'District GDP', value: 31200, prefix: '₹', suffix: 'Cr', growth: 10.4, trend: 'up', displayOrder: 1 },
            { key: 'per_capita_income', title: 'Per Capita Income', value: 138400, prefix: '₹', suffix: '', growth: 7.8, trend: 'up', displayOrder: 2 },
            { key: 'total_population', title: 'Total Population', value: 23.83, prefix: '', suffix: 'Lakhs', growth: 1.4, trend: 'up', displayOrder: 3 },
            { key: 'employment_rate', title: 'Employment Rate', value: 45.6, prefix: '', suffix: '%', growth: 1.6, trend: 'up', displayOrder: 4 },
            { key: 'total_industries', title: 'Total Industries', value: 3860, prefix: '', suffix: '', growth: 4.6, trend: 'up', displayOrder: 5 },
            { key: 'total_exports', title: 'Total Exports', value: 842, prefix: '₹', suffix: 'Cr', growth: 11.2, trend: 'up', displayOrder: 6 },
            { key: 'registered_businesses', title: 'Registered Businesses', value: 10640, prefix: '', suffix: '', growth: 7.8, trend: 'up', displayOrder: 7 },
            { key: 'active_msmes', title: 'Active MSMEs', value: 65388, prefix: '', suffix: '', growth: 9.4, trend: 'up', displayOrder: 8 },
            { key: 'startup_count', title: 'Startup Count', value: 164, prefix: '', suffix: '', growth: 16.8, trend: 'up', displayOrder: 9 },
            { key: 'industrial_growth', title: 'Industrial Growth', value: 8.6, prefix: '', suffix: '%', growth: 1.4, trend: 'up', displayOrder: 10 },
            { key: 'tax_revenue', title: 'Tax Revenue', value: 2640, prefix: '₹', suffix: 'Cr', growth: 12.6, trend: 'up', displayOrder: 11 },
            { key: 'exporters_count', title: 'Exporters Count', value: 156, prefix: '', suffix: '', growth: 5.4, trend: 'up', displayOrder: 12 }
        ].map(kpi => ({ ...kpi, ...defaultMeta }));
        await DashboardKPI.insertMany(kpis);

        // 2. Industry Distribution
        await IndustryDistribution.create({ ...defaultMeta, industries: [
            { name:'Manufacturing', value:1042, pct:'27.0%', color:'#3b82f6', displayOrder:1 },
            { name:'Agriculture', value:888, pct:'23.0%', color:'#f59e0b', displayOrder:2 },
            { name:'Retail & Wholesale', value:695, pct:'18.0%', color:'#f97316', displayOrder:3 },
            { name:'Services', value:540, pct:'14.0%', color:'#06b6d4', displayOrder:4 },
            { name:'Education', value:309, pct:'8.0%', color:'#8b5cf6', displayOrder:5 },
            { name:'Healthcare', value:193, pct:'5.0%', color:'#14b8a6', displayOrder:6 },
            { name:'Logistics', value:116, pct:'3.0%', color:'#ec4899', displayOrder:7 },
            { name:'Mining', value:77, pct:'2.0%', color:'#a78bfa', displayOrder:8 }
        ]});

        // 3. Business Growth
        await BusinessGrowth.create({ ...defaultMeta, monthlyData: [
            {month:'Apr', newReg:284, active:3540, monthOrder:1}, {month:'May', newReg:256, active:3640, monthOrder:2},
            {month:'Jun', newReg:318, active:3760, monthOrder:3}, {month:'Jul', newReg:396, active:3940, monthOrder:4},
            {month:'Aug', newReg:372, active:4080, monthOrder:5}, {month:'Sep', newReg:278, active:4140, monthOrder:6},
            {month:'Oct', newReg:424, active:4340, monthOrder:7}, {month:'Nov', newReg:368, active:4490, monthOrder:8},
            {month:'Dec', newReg:342, active:4610, monthOrder:9}, {month:'Jan', newReg:414, active:4800, monthOrder:10},
            {month:'Feb', newReg:296, active:4890, monthOrder:11}, {month:'Mar', newReg:436, active:5100, monthOrder:12}
        ]});

        // 4. Workforce Analytics
        await WorkforceAnalytics.create({ ...defaultMeta, workingPopulation: 11.38, skilledWorkforce: 3.24, unemploymentRate: 3.7, femaleWorkforce: 27.2, sectorDistribution: [
            {name:'Agriculture', value:34, color:'#f59e0b', displayOrder:1}, {name:'Manufacturing', value:22, color:'#3b82f6', displayOrder:2},
            {name:'Services', value:16, color:'#06b6d4', displayOrder:3}, {name:'Retail', value:12, color:'#ef4444', displayOrder:4},
            {name:'Education', value:8, color:'#8b5cf6', displayOrder:5}, {name:'Healthcare', value:5, color:'#ec4899', displayOrder:6},
            {name:'Logistics', value:3, color:'#14b8a6', displayOrder:7}
        ]});

        // 5. Skill Gap Analysis
        await SkillGapAnalysis.create({ ...defaultMeta, skills: [
            {skill:'Defence & Mfg', demand:2600, available:1800, displayOrder:1}, {skill:'Silk & Textile', demand:2200, available:1900, displayOrder:2},
            {skill:'IT & Software', demand:1700, available:680, displayOrder:3}, {skill:'Agri-Processing', demand:2000, available:1500, displayOrder:4},
            {skill:'Sales & Mktg', demand:1500, available:780, displayOrder:5}, {skill:'Healthcare', demand:1300, available:620, displayOrder:6},
            {skill:'Finance', demand:1000, available:580, displayOrder:7}, {skill:'Logistics', demand:900, available:720, displayOrder:8}
        ]});

        // 6. Digital Adoption
        await DigitalAdoption.create({ ...defaultMeta, metrics: [
            {label:'Has Website', pct:24.8, color:'#3b82f6', displayOrder:1}, {label:'Social Media', pct:44.6, color:'#03D985', displayOrder:2},
            {label:'Digital Payments', pct:63.2, color:'#f97316', displayOrder:3}, {label:'E-commerce Enabled', pct:14.8, color:'#8b5cf6', displayOrder:4},
            {label:'Uses CRM / ERP', pct:9.6, color:'#ef4444', displayOrder:5}, {label:'Online Sales', pct:20.4, color:'#06b6d4', displayOrder:6}
        ]});

        // 7. Export Analytics
        await ExportAnalytics.create({ ...defaultMeta, totalExport: 842, exportingUnits: 156, countriesExported: 19, 
            products: [
                {product:'Silk & Textiles', value:269, pct:'32%', displayOrder:1}, {product:'Defence Components', value:219, pct:'26%', displayOrder:2},
                {product:'Cement & Stone', value:168, pct:'20%', displayOrder:3}, {product:'Agri Products', value:118, pct:'14%', displayOrder:4},
                {product:'Others', value:68, pct:'8%', displayOrder:5}
            ],
            destinations: [
                {country:'UAE', flag:'🇦🇪', pct:20, displayOrder:1}, {country:'USA', flag:'🇺🇸', pct:18, displayOrder:2},
                {country:'Bangladesh', flag:'🇧🇩', pct:15, displayOrder:3}, {country:'UK', flag:'🇬🇧', pct:14, displayOrder:4},
                {country:'Others', flag:'🌐', pct:33, displayOrder:5}
            ]
        });

        // 8. Industry Health
        await IndustryHealth.create({ ...defaultMeta, industries: [
            {name:'Manufacturing', score:80, color:'#03D985', displayOrder:1, trend:[71,74,70,76,73,77,75,79,76,78,75,80,77,79,80]},
            {name:'Agriculture', score:72, color:'#03D985', displayOrder:2, trend:[64,67,63,69,66,70,68,72,69,71,68,73,70,72,72]},
            {name:'Education', score:70, color:'#03D985', displayOrder:3, trend:[62,65,61,67,64,68,66,70,67,69,66,71,68,70,70]},
            {name:'Mining', score:62, color:'#f59e0b', displayOrder:4, trend:[55,58,54,60,57,61,59,63,60,62,59,64,61,63,62]},
            {name:'Retail & Wholesale', score:64, color:'#f59e0b', displayOrder:5, trend:[57,60,56,62,59,63,61,65,62,64,61,65,62,64,64]},
            {name:'Services', score:58, color:'#f59e0b', displayOrder:6, trend:[51,54,50,56,53,57,55,59,56,58,55,60,57,59,58]},
            {name:'Healthcare', score:54, color:'#f59e0b', displayOrder:7, trend:[47,50,46,52,49,53,51,55,52,54,51,56,53,55,54]},
            {name:'Logistics', score:46, color:'#ef4444', displayOrder:8, trend:[56,53,58,50,55,49,53,48,51,49,50,47,49,47,46]}
        ]});

        // 9. Economic Map
        await EconomicMap.create({ ...defaultMeta, points: [
            {label:'Industrial Cluster (Jhansi City)', lat:25.4484, lng:78.5685, category:'Industrial Cluster', color:'#3b82f6', description:'', displayOrder:1},
            {label:'BHEL Jhansi (Heavy Engineering)', lat:25.4780, lng:78.5500, category:'Industrial Cluster', color:'#3b82f6', description:'', displayOrder:2},
            {label:'Bijauli Industrial Area', lat:25.3900, lng:78.6200, category:'Industrial Cluster', color:'#3b82f6', description:'', displayOrder:3},
            {label:'MSME Unit (Mauranipur)', lat:25.2000, lng:79.0700, category:'MSME Unit', color:'#03D985', description:'', displayOrder:4},
            {label:'Education Hub (Bundelkhand Univ)', lat:25.4384, lng:78.5740, category:'Education Institute', color:'#8b5cf6', description:'', displayOrder:5},
            {label:'Skill Center (ITI Jhansi)', lat:25.4500, lng:78.5800, category:'Skill Center', color:'#06b6d4', description:'', displayOrder:6},
            {label:'Agri Warehouse Zone (Moth)', lat:25.7200, lng:78.6500, category:'Warehouse', color:'#ec4899', description:'', displayOrder:7},
            {label:'High Unemp. Zone (Garautha)', lat:25.5600, lng:79.2800, category:'High Unemployment Zone', color:'#ef4444', description:'', displayOrder:8},
            {label:'Mining Area (Tehroli)', lat:25.3100, lng:79.1200, category:'Mining Area', color:'#f59e0b', description:'', displayOrder:9},
            {label:'MSME Unit (Parichha)', lat:25.4800, lng:78.8200, category:'MSME Unit', color:'#03D985', description:'', displayOrder:10},
            {label:'Skill Center (Babina-Defence)', lat:25.3500, lng:78.3800, category:'Skill Center', color:'#06b6d4', description:'', displayOrder:11},
            {label:'Industrial Cluster (Kanpur Road)', lat:25.5200, lng:78.5300, category:'Industrial Cluster', color:'#3b82f6', description:'', displayOrder:12}
        ]});

        // 10. Infrastructure Stats
        await InfrastructureStats.create({ ...defaultMeta, stats: [
            {label:'Literacy Rate', value:'75.05%', displayOrder:1}, {label:'Youth (15-35)', value:'8.94 Lakhs', displayOrder:2},
            {label:'No. of Colleges', value:'32', displayOrder:3}, {label:'No. of ITIs', value:'14', displayOrder:4},
            {label:'Skill Centers', value:'18', displayOrder:5}, {label:'Road Connectivity', value:'91%', displayOrder:6},
            {label:'Internet Penetration', value:'61%', displayOrder:7}
        ]});

        console.log('Seeding Success!');
        process.exit(0);
    } catch (error) {
        console.error('Seeder Error:', error);
        process.exit(1);
    }
};

seedData();