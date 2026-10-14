// src/pages/Cohorts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import CohortCard from '../components/cohorts/CohortCard';
import { getAllCohorts } from '../api/cohortApi';

export default function Cohorts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [cohorts, setCohorts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchCohorts();
  }, [searchQuery, statusFilter]);

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { limit: 100 }; // Adjust as needed
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;

      const response = await getAllCohorts(params);
      if (response.success) {
        setCohorts(response.data);
        setTotal(response.pagination?.total || response.data.length);
      }
    } catch (err) {
      setError(err.message || 'Failed to load cohorts');
    } finally {
      setLoading(false);
    }
  };

  const activeCount = cohorts.filter(c => c.status === 'Active').length;
  const totalMembers = cohorts.reduce((sum, c) => sum + (c.totalMembers || 0), 0);
  const avgCompletion = '0.0%'; // To be implemented with tracking logic

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div 
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 main-content-scroll"
        style={{ background: '#f5f5f5', fontFamily: 'var(--font-sora)' }}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          {/* Adjusted padding for mobile vs desktop */}
          <div className="p-4 sm:p-6 lg:p-8 min-h-screen max-w-[1400px] mx-auto w-full">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <div>
                <h1 className="text-2xl sm:text-[28px] font-bold text-[#111111] mb-1">Cohorts</h1>
                <p className="text-sm text-[#888888] m-0">Manage training batches and skill development programs</p>
              </div>
            </div>

            {/* KPI Cards - Responsive Grid */}
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
              {[
                { label: 'Total Cohorts', value: total, color: '#111111' },
                { label: 'Active Cohorts', value: activeCount, color: '#03D985' },
                { label: 'Total Members', value: totalMembers, color: '#111111' },
                { label: 'Avg. Completion', value: avgCompletion, color: '#111111' }
              ].map((kpi, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-sm">
                  <div className="text-[28px] font-bold leading-none mb-2" style={{ color: kpi.color }}>
                    {kpi.value}
                  </div>
                  <div className="text-[13px] text-[#888888] font-medium">
                    {kpi.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Filters - Responsive Flex-col on mobile, row on tablet */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
              <input
                type="text"
                placeholder="Search cohorts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input w-full sm:w-[280px] px-3.5 py-2.5 rounded-lg border border-[#dddddd] outline-none focus:border-[#03D985] text-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select w-full sm:w-[180px] px-3.5 py-2.5 rounded-lg border border-[#dddddd] outline-none bg-white focus:border-[#03D985] text-sm"
              >
                <option value="">All Statuses</option>
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Error State */}
            {error && (
              <div className="p-4 bg-[#fef2f2] text-[#ef4444] border border-[#fecaca] rounded-lg mb-4 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Loading / Empty / Content States */}
            {loading ? (
              <div className="flex justify-center py-10 sm:py-16">
                <div className="w-10 h-10 border-[3px] border-[#e5e7eb] border-t-[#03D985] rounded-full animate-spin" />
              </div>
            ) : cohorts.length === 0 ? (
              <div className="text-center py-12 px-5 bg-white rounded-xl border border-[#e5e7eb]">
                <div className="w-20 h-20 bg-[rgba(3,217,133,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#02b870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#111111] mb-2">No cohorts found</h3>
                <p className="text-sm text-[#888888] m-0">Create your first cohort from the Resource Pool page</p>
              </div>
            ) : (
              /* Replaced fixed minmax with standard responsive grid to fix screen overflow */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {cohorts.map(cohort => (
                  <CohortCard 
                    key={cohort._id} 
                    cohort={cohort} 
                    onClick={() => navigate(`/cohorts/${cohort._id}`)} 
                  />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}