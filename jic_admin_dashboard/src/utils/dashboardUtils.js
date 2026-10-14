import * as XLSX from 'xlsx/xlsx.mjs';
// ... existing imports ...
import {
  KPI_ROW_1 as STATIC_KPI_ROW_1, KPI_ROW_2 as STATIC_KPI_ROW_2, INDUSTRY_DATA as STATIC_INDUSTRY_DATA, 
  GROWTH_DATA as STATIC_GROWTH_DATA, SECTOR_DATA as STATIC_SECTOR_DATA, SKILL_DATA as STATIC_SKILL_DATA, 
  ADOPTION_DATA as STATIC_ADOPTION_DATA, EXPORT_PRODUCTS as STATIC_EXPORT_PRODUCTS, 
  EXPORT_DESTINATIONS as STATIC_EXPORT_DESTINATIONS, INDUSTRY_HEALTH as STATIC_INDUSTRY_HEALTH, BOTTOM_STATS as STATIC_BOTTOM_STATS
} from '../components/data/dashboardData';

export const exportDashboardToExcel = (period, liveData) => {
  const wb = XLSX.utils.book_new();

  const kpiData = liveData ? [...liveData.kpiRow1, ...liveData.kpiRow2].map(item => ({ Metric: item.label, Value: item.value, Trend: item.trend })) 
                           : [...STATIC_KPI_ROW_1, ...STATIC_KPI_ROW_2].map(item => ({ Metric: item.label, Value: item.value, Trend: item.trend }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kpiData), 'KPI Summary');

  const indData = liveData?.industryData || STATIC_INDUSTRY_DATA;
  const industrySheet = indData.map(item => ({ Industry: item.name, Count: item.value, Percentage: item.pct }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(industrySheet), 'Industry Distribution');

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(liveData?.growthData || STATIC_GROWTH_DATA), 'Business Growth Trend');

  const secData = liveData?.sectorData || STATIC_SECTOR_DATA;
  const sectorSheet = secData.map(item => ({ Sector: item.name, Percentage: `${item.value}%` }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sectorSheet), 'Sector Employment');

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(liveData?.skillData || STATIC_SKILL_DATA), 'Skill Gap Analysis');

  const adpData = liveData?.adoptionData || STATIC_ADOPTION_DATA;
  const adoptionSheet = adpData.map(item => ({ Metric: item.label, Percentage: `${item.pct}%` }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(adoptionSheet), 'Digital Adoption');

  const expProd = liveData?.exportProducts || STATIC_EXPORT_PRODUCTS;
  const exportProdSheet = expProd.map(item => ({ Product: item.product, Value: item.value, Percentage: item.pct }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(exportProdSheet), 'Export Products');
  
  const expDest = liveData?.exportDestinations || STATIC_EXPORT_DESTINATIONS;
  const exportDestSheet = expDest.map(item => ({ Destination: item.country, Percentage: `${item.pct}%` }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(exportDestSheet), 'Export Destinations');

  const hlthData = liveData?.industryHealth || STATIC_INDUSTRY_HEALTH;
  const healthSheet = hlthData.map(item => ({ Industry: item.name, Score: item.score }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(healthSheet), 'Industry Health');

  const btmData = liveData?.bottomStats || STATIC_BOTTOM_STATS;
  const bottomStatsSheet = btmData.map(item => ({ Metric: item.label, Value: item.value }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(bottomStatsSheet), 'Bottom Stats');

  const fileName = `District_Overview_Satna_${period.replace(/\s/g, '_')}.xlsx`;
  XLSX.writeFile(wb, fileName);
};