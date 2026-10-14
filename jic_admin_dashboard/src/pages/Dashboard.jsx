import React, { useMemo, useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import useDashboardStats from '../hooks/useDashboardStats';

import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
import DashboardCard12 from '../partials/dashboard/DashboardCard12';
import DashboardCard13 from '../partials/dashboard/DashboardCard13';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({ statuses: [], sources: [] });
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: null,
    to: null,
  });

  const dashboardFilters = useMemo(() => ({
    ...selectedFilters,
    dateRange: selectedDateRange,
  }), [selectedDateRange, selectedFilters]);

  const { stats, loading, error } = useDashboardStats(dashboardFilters);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      {/* Content area */}
      <div
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          background: '#f5f5f5',  // Just the light background
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap w-full sm:w-auto gap-2 sm:justify-end">
                {/* Filter button */}
                <FilterButton align="right" value={selectedFilters} onChange={setSelectedFilters} />
                {/* Datepicker built with React Day Picker */}
                <Datepicker align="right" value={selectedDateRange} onChange={setSelectedDateRange} />
                
                {/* Replaced Add View button with Live Total Counter */}
                <div className="btn w-full sm:w-auto justify-center bg-violet-500 text-white cursor-default whitespace-nowrap">
                  Total Records: {loading ? '...' : stats?.grandTotal ?? 0}
                </div>                
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Line 1 - Module Summaries */}
              <DashboardCard01 data={stats} loading={loading} />
              <DashboardCard02 data={stats} loading={loading} />
              <DashboardCard03 data={stats} loading={loading} />

              {/* Line 2 - Industries */}
              {/* <DashboardCard04 data={stats} loading={loading} /> */}
              {/* <DashboardCard05 data={stats} loading={loading} /> */}

              {/* Line 3 - Distribution  */}
              <DashboardCard06 data={stats} loading={loading} />
              <DashboardCard07 data={stats} loading={loading} />

              {/* Line 4 - Trends */}
              <DashboardCard08 data={stats} loading={loading} />
              <DashboardCard09 data={stats} loading={loading} />

              {/* Line 5 - Recent & Statuses */}
              <DashboardCard10 data={stats} loading={loading} />
              <DashboardCard11 data={stats} loading={loading} />

              {/* Line 6 - Activity & Logs */}
              <DashboardCard12 data={stats} loading={loading} />
              <DashboardCard13 data={stats} loading={loading} /> 
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;