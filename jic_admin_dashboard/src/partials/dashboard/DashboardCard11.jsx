import React from 'react';
import BarChart from '../../charts/BarChart03';
import { getCssVariable } from '../../utils/Utils';

export default function DashboardCard11({ data, loading }) {
  if (loading || !data) {
    return <div className="col-span-full sm:col-span-6 bg-gray-200 dark:bg-gray-700 animate-pulse h-[160px] rounded-xl"></div>;
  }

  const chartData = {
    labels: ['Status'],
    datasets: [
      {
        label: 'Active',
        data: [data.totalActive],
        backgroundColor: getCssVariable('--color-violet-500'),
        hoverBackgroundColor: getCssVariable('--color-violet-600'),
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'Verified / Placed',
        data: [data.totalVerified],
        backgroundColor: getCssVariable('--color-sky-500'),
        hoverBackgroundColor: getCssVariable('--color-sky-600'),
        barPercentage: 1,
        categoryPercentage: 1,
      },
      {
        label: 'Inactive / Blacklisted',
        data: [data.totalInactive],
        backgroundColor: getCssVariable('--color-violet-700'),
        hoverBackgroundColor: getCssVariable('--color-violet-800'),
        barPercentage: 1,
        categoryPercentage: 1,
      },
    ],
  };

  const activePercent = data.grandTotal > 0 ? Math.round((data.totalActive / data.grandTotal) * 100) : 0;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Status Distribution</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{data.totalActive}</div>
          <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">{activePercent}% Active</div>
        </div>
      </div>      
      <div className="grow">
        <BarChart data={chartData} width={595} height={48} />
      </div>
    </div>
  );
}
