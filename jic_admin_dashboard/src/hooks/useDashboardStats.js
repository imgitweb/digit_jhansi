import { useState, useEffect, useCallback } from 'react';
import { getResources } from '../api/resourceApi';
import { getRiders } from '../api/riderApi';
import { getEnablers } from '../api/enablerApi';
import { getIndustries } from '../api/industryUnder50LApi';
import { getIndustries50L } from '../api/industry50LPlusApi';

const MODULE_CONFIG = [
  { key: 'resources', label: 'Resource Hub', listApi: getResources },
  { key: 'riders', label: 'Riders Database', listApi: getRiders },
  { key: 'enablers', label: 'Ecommerce Enablers', listApi: getEnablers },
  { key: 'under50L', label: 'Industry Pool (<50L)', listApi: getIndustries },
  { key: 'plus50L', label: 'Industry Pool (50L+)', listApi: getIndustries50L },
];

const FALLBACK_RANGE = { from: null, to: null };
const STATUS_GROUPS = {
  active: new Set(['active']),
  inactive: new Set(['inactive', 'blacklisted']),
  verified: new Set(['verified', 'placed']),
};
const SOURCE_GROUPS = {
  excel: new Set(['excel upload', 'excel', 'upload']),
  manual: new Set(['manual entry', 'manual']),
};

const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeText = (value) => String(value ?? '').trim().toLowerCase();

const normalizeStatus = (value) => {
  const normalized = normalizeText(value);
  if (STATUS_GROUPS.active.has(normalized)) return 'active';
  if (STATUS_GROUPS.inactive.has(normalized)) return 'inactive';
  if (STATUS_GROUPS.verified.has(normalized)) return 'verified';
  return 'other';
};

const normalizeSource = (value) => {
  const normalized = normalizeText(value);
  if (SOURCE_GROUPS.excel.has(normalized)) return 'excel';
  if (SOURCE_GROUPS.manual.has(normalized)) return 'manual';
  return 'unknown';
};

const isTruthyBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  const normalized = normalizeText(value);
  return normalized === 'true' || normalized === 'yes';
};

const getRecordName = (item) =>
  item?.fullName ??
  item?.companyName ??
  item?.ownerName ??
  item?.ownerCeoName ??
  'Unknown';

const getRecordContact = (item) => item?.phoneNumber ?? item?.contactNumber ?? '-';

const normalizeRecord = (item, moduleKey) => {
  const createdAt = toDate(item?.createdAt);
  return {
    ...item,
    _moduleKey: moduleKey,
    _createdAt: createdAt,
    _statusGroup: normalizeStatus(item?.status),
    _sourceGroup: normalizeSource(item?.registrationSource),
    _displayName: getRecordName(item),
    _contactValue: getRecordContact(item),
  };
};

const getRangeEnd = (selectedRange) => {
  const to = toDate(selectedRange?.to);
  if (to) {
    const rangeEnd = new Date(to);
    rangeEnd.setHours(23, 59, 59, 999);
    return rangeEnd;
  }

  return new Date();
};

const getRangeStart = (selectedRange) => {
  const from = toDate(selectedRange?.from);
  if (from) {
    const rangeStart = new Date(from);
    rangeStart.setHours(0, 0, 0, 0);
    return rangeStart;
  }

  return null;
};

const getMonthLabels = (count, rangeEnd) => {
  const result = [];
  const end = new Date(rangeEnd);
  end.setDate(1);
  for (let index = count - 1; index >= 0; index -= 1) {
    const month = new Date(end.getFullYear(), end.getMonth() - index, 1);
    result.push(month.toLocaleString('default', { month: 'short', year: '2-digit' }));
  }
  return result;
};

const groupDataByMonth = (data, count, rangeEnd, filterFn = () => true) => {
  const result = Array(count).fill(0);
  const end = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);

  data.forEach((item) => {
    if (!filterFn(item) || !item?._createdAt) return;
    const itemDate = item._createdAt;
    const monthsDiff = (end.getFullYear() - itemDate.getFullYear()) * 12 + (end.getMonth() - itemDate.getMonth());
    if (monthsDiff >= 0 && monthsDiff < count) {
      result[count - 1 - monthsDiff] += 1;
    }
  });

  return result;
};

const groupDataByPrevMonth = (data, count, rangeEnd, filterFn = () => true) => {
  const result = Array(count).fill(0);
  const end = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);

  data.forEach((item) => {
    if (!filterFn(item) || !item?._createdAt) return;
    const itemDate = item._createdAt;
    const monthsDiff = (end.getFullYear() - itemDate.getFullYear()) * 12 + (end.getMonth() - itemDate.getMonth());
    if (monthsDiff >= count && monthsDiff < count * 2) {
      result[count - 1 - (monthsDiff - count)] += 1;
    }
  });

  return result;
};

const isWithinRange = (date, rangeStart, rangeEnd) => {
  if (!date) return false;
  if (rangeStart && date < rangeStart) return false;
  if (rangeEnd && date > rangeEnd) return false;
  return true;
};

const applyDashboardFilters = (records, filters, rangeStart, rangeEnd) => {
  const selectedStatuses = new Set(filters?.statuses ?? []);
  const selectedSources = new Set(filters?.sources ?? []);

  return records.filter((record) => {
    if (!isWithinRange(record?._createdAt, rangeStart, rangeEnd)) return false;
    if (selectedStatuses.size > 0 && !selectedStatuses.has(record?._statusGroup)) return false;
    if (selectedSources.size > 0 && !selectedSources.has(record?._sourceGroup)) return false;
    return true;
  });
};

const buildModuleStats = (records, rangeStart, rangeEnd) => {
  const monthStart = new Date(rangeEnd);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const active = records.filter((item) => item?._statusGroup === 'active').length;
  const inactive = records.filter((item) => item?._statusGroup === 'inactive').length;
  const verified = records.filter((item) => item?._statusGroup === 'verified').length;
  const thisMonth = records.filter((item) => isWithinRange(item?._createdAt, monthStart, rangeEnd)).length;
  const totalExcel = records.filter((item) => item?._sourceGroup === 'excel').length;
  const totalManual = records.filter((item) => item?._sourceGroup === 'manual').length;

  return {
    total: records.length,
    active,
    inactive,
    verified,
    thisMonth,
    history12m: groupDataByMonth(records, 12, rangeEnd),
    prevHistory12m: groupDataByPrevMonth(records, 12, rangeEnd),
    history6mActive: groupDataByMonth(records, 6, rangeEnd, (item) => item?._statusGroup === 'active'),
    history6mInactiveVerified: groupDataByMonth(records, 6, rangeEnd, (item) => item?._statusGroup === 'inactive' || item?._statusGroup === 'verified'),
    ecommerceEnabled12m: groupDataByMonth(
      records,
      12,
      rangeEnd,
      (item) => isTruthyBoolean(item?.digital?.ecommerceEnabled) || isTruthyBoolean(item?.growth?.openToEcommerce),
    ),
    exporting12m: groupDataByMonth(
      records,
      12,
      rangeEnd,
      (item) => isTruthyBoolean(item?.export?.exportsCurrently) || isTruthyBoolean(item?.growth?.doesExport),
    ),
    excel6m: groupDataByMonth(records, 6, rangeEnd, (item) => item?._sourceGroup === 'excel'),
    manual6m: groupDataByMonth(records, 6, rangeEnd, (item) => item?._sourceGroup === 'manual'),
    totalExcel,
    totalManual,
    error: false,
  };
};

const buildEmptyModuleStats = () => ({
  total: 0,
  active: 0,
  inactive: 0,
  verified: 0,
  thisMonth: 0,
  history12m: Array(12).fill(0),
  prevHistory12m: Array(12).fill(0),
  history6mActive: Array(6).fill(0),
  history6mInactiveVerified: Array(6).fill(0),
  ecommerceEnabled12m: Array(12).fill(0),
  exporting12m: Array(12).fill(0),
  excel6m: Array(6).fill(0),
  manual6m: Array(6).fill(0),
  totalExcel: 0,
  totalManual: 0,
  error: false,
});

const fetchAllPages = async (listApi) => {
  const limit = 200;
  const firstResponse = await listApi({ page: 1, limit });
  const firstPageData = firstResponse?.data ?? [];
  const total = Number(firstResponse?.pagination?.total ?? firstPageData.length ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages === 1) {
    return firstPageData;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => listApi({ page: index + 2, limit })),
  );

  return remainingPages.reduce(
    (allRecords, response) => [...allRecords, ...(response?.data ?? [])],
    [...firstPageData],
  );
};

export default function useDashboardStats(filters = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const rangeEnd = getRangeEnd(filters?.dateRange ?? FALLBACK_RANGE);
      const rangeStart = getRangeStart(filters?.dateRange ?? FALLBACK_RANGE);
      const results = await Promise.allSettled(
        MODULE_CONFIG.map(async (moduleConfig) => {
          const allRecords = await fetchAllPages(moduleConfig.listApi);
          const normalizedRecords = allRecords.map((item) => normalizeRecord(item, moduleConfig.key));
          const filteredRecords = applyDashboardFilters(normalizedRecords, filters, rangeStart, rangeEnd);
          const recentRecords = [...filteredRecords]
            .sort((left, right) => (right?._createdAt?.getTime() ?? 0) - (left?._createdAt?.getTime() ?? 0))
            .slice(0, 6);

          return {
            ...moduleConfig,
            filteredRecords,
            recentRecords,
          };
        }),
      );

      const parsedData = MODULE_CONFIG.reduce((accumulator, moduleConfig) => {
        accumulator[moduleConfig.key] = buildEmptyModuleStats();
        return accumulator;
      }, {});
      const recentData = {};
      let grandTotal = 0;
      let totalActive = 0;
      let totalInactive = 0;
      let totalVerified = 0;
      let allMergedRecords = [];

      results.forEach((result, index) => {
        const moduleConfig = MODULE_CONFIG[index];

        if (result.status === 'rejected') {
          parsedData[moduleConfig.key] = {
            ...buildEmptyModuleStats(),
            error: true,
          };
          recentData[moduleConfig.key] = [];
          return;
        }

        const moduleStats = buildModuleStats(result.value.filteredRecords, rangeStart, rangeEnd);
        parsedData[moduleConfig.key] = moduleStats;
        recentData[moduleConfig.key] = result.value.recentRecords;
        allMergedRecords = [...allMergedRecords, ...result.value.filteredRecords];
        grandTotal += moduleStats.total;
        totalActive += moduleStats.active;
        totalInactive += moduleStats.inactive;
        totalVerified += moduleStats.verified;
      });

      allMergedRecords.sort((left, right) => (right?._createdAt?.getTime() ?? 0) - (left?._createdAt?.getTime() ?? 0));

      const moduleOverview = MODULE_CONFIG.map((moduleConfig) => ({
        key: moduleConfig.key,
        name: moduleConfig.label,
        stats: parsedData[moduleConfig.key] ?? buildEmptyModuleStats(),
      }));

      const moduleDistribution = moduleOverview.map((moduleItem, index) => ({
        key: moduleItem.key,
        label: moduleItem.name,
        value: moduleItem.stats?.total ?? 0,
        colorToken:
          index === 0 ? '--color-violet-500'
          : index === 1 ? '--color-sky-500'
          : index === 2 ? '--color-green-500'
          : index === 3 ? '--color-violet-800'
          : '--color-sky-600',
        hoverColorToken:
          index === 0 ? '--color-violet-600'
          : index === 1 ? '--color-sky-600'
          : index === 2 ? '--color-green-600'
          : index === 3 ? '--color-violet-700'
          : '--color-sky-500',
      }));

      setStats({
        ...parsedData,
        grandTotal,
        totalActive,
        totalInactive,
        totalVerified,
        labels12m: getMonthLabels(12, rangeEnd),
        labels6m: getMonthLabels(6, rangeEnd),
        recentAll: allMergedRecords.slice(0, 5),
        activityFeed: allMergedRecords.slice(0, 6),
        combinedHistory12m: groupDataByMonth(
          allMergedRecords.filter((item) => item?._moduleKey === 'under50L' || item?._moduleKey === 'plus50L'),
          12,
          rangeEnd,
        ),
        totalExcelAll: allMergedRecords.filter((item) => item?._sourceGroup === 'excel').length,
        totalManualAll: allMergedRecords.filter((item) => item?._sourceGroup === 'manual').length,
        excel6mAll: groupDataByMonth(allMergedRecords, 6, rangeEnd, (item) => item?._sourceGroup === 'excel'),
        manual6mAll: groupDataByMonth(allMergedRecords, 6, rangeEnd, (item) => item?._sourceGroup === 'manual'),
        recentResources: recentData.resources ?? [],
        recentRiders: recentData.riders ?? [],
        recentEnablers: recentData.enablers ?? [],
        recentIndustriesUnder50L: recentData.under50L ?? [],
        recentIndustries50LPlus: recentData.plus50L ?? [],
        moduleOverview,
        moduleDistribution,
        appliedFilters: {
          statuses: filters?.statuses ?? [],
          sources: filters?.sources ?? [],
          dateRange: {
            from: rangeStart,
            to: rangeEnd,
          },
        },
      });
    } catch (err) {
      setError('A critical error occurred while fetching dashboard statistics.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}