import axiosInstance from './axiosInstance';

const BASE = '/dashboard';

// Unified Axios request function
const req = async (url, method = 'GET', data = null, auth = false) => {
  const headers = {};
  if (auth) {
    const token = localStorage.getItem('adminToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await axiosInstance({ url, method, data, headers });
  if (!res.data.success) throw new Error(res.data.message || 'Request failed');
  return res.data.data;
};

// Overview
export const getOverview = (period = 'this_year') =>
  req(`${BASE}/overview?period=${period}`);

// KPIs
export const getKPIsPublished = (period) =>
  req(`${BASE}/kpis-data?period=${period}`);
export const getKPIsAll = () =>
  req(`${BASE}/kpis-data/all`, 'GET', null, true);
export const createKPI = (body) =>
  req(`${BASE}/kpis-data`, 'POST', body, true);
export const createKPIsBulk = (body) =>
  req(`${BASE}/kpis-data/bulk`, 'POST', body, true);
export const updateKPI = (id, body) =>
  req(`${BASE}/kpis-data/${id}`, 'PUT', body, true);
export const publishKPI = (id) =>
  req(`${BASE}/kpis-data/${id}/publish`, 'PATCH', null, true);
export const unpublishKPI = (id) =>
  req(`${BASE}/kpis-data/${id}/unpublish`, 'PATCH', null, true);
export const deleteKPI = (id) =>
  req(`${BASE}/kpis-data/${id}`, 'DELETE', null, true);

// Generic section factory
const sectionAPI = (slug) => ({
  getPublished: (period) =>
    req(`${BASE}/${slug}?period=${period}`),
  getAll: () =>
    req(`${BASE}/${slug}/all`, 'GET', null, true),
  create: (body) =>
    req(`${BASE}/${slug}`, 'POST', body, true),
  update: (id, body) =>
    req(`${BASE}/${slug}/${id}`, 'PUT', body, true),
  publish: (id) =>
    req(`${BASE}/${slug}/${id}/publish`, 'PATCH', null, true),
  unpublish: (id) =>
    req(`${BASE}/${slug}/${id}/unpublish`, 'PATCH', null, true),
  remove: (id) =>
    req(`${BASE}/${slug}/${id}`, 'DELETE', null, true),
});

export const industryDistributionApi = sectionAPI('industry-distribution');
export const businessGrowthApi       = sectionAPI('business-growth');
export const workforceApi            = sectionAPI('workforce-analytics');
export const skillGapApi             = sectionAPI('skill-gap-analysis');
export const digitalAdoptionApi      = sectionAPI('digital-adoption');
export const exportAnalyticsApi      = sectionAPI('export-analytics');
export const industryHealthApi       = sectionAPI('industry-health');
export const economicMapApi          = sectionAPI('economic-map');
export const infrastructureStatsApi  = sectionAPI('infrastructure-stats');