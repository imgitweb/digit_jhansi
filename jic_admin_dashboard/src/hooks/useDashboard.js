import { useState, useEffect, useCallback } from 'react';
import { getOverview } from '../api/dashboardApi';
import { Factory, Users, Globe, Briefcase, Building2, ShieldCheck, Zap, TrendingUp, BarChart2, Award, BookOpen, GraduationCap, MapPin, Wifi } from 'lucide-react';

const PERIOD_MAP = {
  'This Year (2024-25)': 'this_year', 'Last Year (2023-24)': 'last_year',
  'Last 2 Years': 'last_2_years', 'Last 5 Years': 'last_5_years', 'Custom Range': 'custom',
};

const KPI_META = {
  district_gdp: { icon: Factory, iconColor: '#3b82f6' }, per_capita_income: { icon: Users, iconColor: '#f97316' },
  total_population: { icon: Globe, iconColor: '#8b5cf6' }, employment_rate: { icon: Briefcase, iconColor: '#03D985' },
  total_industries: { icon: Factory, iconColor: '#f59e0b' }, total_exports: { icon: Globe, iconColor: '#ef4444' },
  registered_businesses: { icon: Building2, iconColor: '#06b6d4' }, active_msmes: { icon: ShieldCheck, iconColor: '#8b5cf6' },
  startup_count: { icon: Zap, iconColor: '#f97316' }, industrial_growth: { icon: TrendingUp, iconColor: '#03D985' },
  tax_revenue: { icon: BarChart2, iconColor: '#3b82f6' }, exporters_count: { icon: Award, iconColor: '#f59e0b' },
};

export const INFRA_ICON_MAP = {
  'Literacy Rate': BookOpen, 'Youth (15-35)': Users, 'No. of Colleges': GraduationCap,
  'No. of ITIs': Award, 'Skill Centers': Zap, 'Road Connectivity': MapPin, 'Internet Penetration': Wifi,
};

const formatKPI = (doc) => {
  const meta = KPI_META[doc.key] || { icon: Factory, iconColor: '#888' };
  const formatted = Number.isInteger(doc.value) ? doc.value.toLocaleString('en-IN') : doc.value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return {
    icon: meta.icon, iconColor: meta.iconColor, label: doc.title,
    value: `${doc.prefix || ''}${formatted}${doc.suffix ? ' ' + doc.suffix : ''}`,
    trend: `${doc.trend === 'up' ? '+' : '-'}${doc.growth}% vs LY`,
    trendUp: doc.trend === 'up', _raw: doc,
  };
};

export default function useDashboard(selectedPeriod) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    const period = PERIOD_MAP[selectedPeriod] || 'this_year';
    setLoading(true); setError(null);
    try {
      const raw = await getOverview(period);
      if (!raw) { setDashboardData(null); return; }

      const allKpis = (raw.kpis || []).sort((a, b) => a.displayOrder - b.displayOrder);
      const ea = raw.exportAnalytics || {};
      const wf = raw.workforce || {};
      const mapPoints = raw.economicMap?.points?.sort((a, b) => a.displayOrder - b.displayOrder).map(({ label, lat, lng, color, category }) => ({ label, lat, lng, color, category })) || [];
      const seen = new Set();

      // const hasLiveData = allKpis.length > 0 || raw.industryDistribution || raw.businessGrowth;
      // if (!hasLiveData) {
      //   setDashboardData(null); // This triggers the STATIC_ fallbacks in the dashboard
      //   return;
      // }

      setDashboardData({
        kpiRow1: allKpis.filter(k => k.displayOrder <= 6).map(formatKPI),
        kpiRow2: allKpis.filter(k => k.displayOrder > 6).map(formatKPI),
        industryData: raw.industryDistribution?.industries?.sort((a, b) => a.displayOrder - b.displayOrder).map(({ name, value, pct, color }) => ({ name, value, pct, color })) || [],
        growthData: raw.businessGrowth?.monthlyData?.sort((a, b) => a.monthOrder - b.monthOrder).map(({ month, newReg, active }) => ({ month, newReg, active })) || [],
        sectorData: (wf.sectorDistribution || []).sort((a, b) => a.displayOrder - b.displayOrder).map(({ name, value, color }) => ({ name, value, color })),
        skillData: raw.skillGap?.skills?.sort((a, b) => a.displayOrder - b.displayOrder).map(({ skill, demand, available }) => ({ skill, demand, available })) || [],
        adoptionData: raw.digitalAdoption?.metrics?.sort((a, b) => a.displayOrder - b.displayOrder).map(({ label, pct, color }) => ({ label, pct, color })) || [],
        exportProducts: (ea.products || []).sort((a, b) => a.displayOrder - b.displayOrder).map(({ product, value, pct }) => ({ product, value, pct })),
        exportDestinations: (ea.destinations || []).sort((a, b) => a.displayOrder - b.displayOrder).map(({ country, flag, pct }) => ({ country, flag, pct })),
        exportSummary: { totalExport: ea.totalExport || 0, exportingUnits: ea.exportingUnits || 0, countriesExported: ea.countriesExported || 0 },
        industryHealth: raw.industryHealth?.industries?.sort((a, b) => a.displayOrder - b.displayOrder).map(({ name, score, color, trend }) => ({ name, score, color, trend })) || [],
        mapPoints,
        mapLegend: mapPoints.filter(p => !seen.has(p.category) && seen.add(p.category)).map(p => ({ category: p.category, color: p.color })),
        bottomStats: (raw.infrastructureStats?.stats || []).sort((a, b) => a.displayOrder - b.displayOrder).map(item => ({ value: item.value, label: item.label, icon: INFRA_ICON_MAP[item.label] || Zap })),
        workforce: wf,
      });
    } catch (err) {
      setError(err.message); console.error("Dashboard Sync Error:", err);
    } finally { setLoading(false); }
  }, [selectedPeriod]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  return { dashboardData, loading, error, refetch: loadDashboard };
}