import React from 'react';
import BarChart from '../../charts/BarChart02';
import { getCssVariable } from '../../utils/Utils';

export default function DashboardCard09({ data, loading }) {
  if (loading || !data) {
    return <div className="col-span-full sm:col-span-6 bg-gray-200 dark:bg-gray-700 animate-pulse h-[320px] rounded-xl"></div>;
  }

  const chartData = {
    labels: data.labels6m,
    datasets: [
      {
        label: 'Excel Upload',
        data: data.excel6mAll,
        backgroundColor: getCssVariable('--color-violet-500'),
        hoverBackgroundColor: getCssVariable('--color-violet-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      {
        label: 'Manual Entry',
        data: data.manual6mAll,
        backgroundColor: getCssVariable('--color-gray-500'),
        hoverBackgroundColor: getCssVariable('--color-gray-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };

  const uploadPercentage = data.grandTotal > 0 ? Math.round((data.totalExcelAll / data.grandTotal) * 100) : 0;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Excel Upload vs Manual Entry</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{data.totalExcelAll}</div>
          <div className="text-sm font-medium text-violet-700 px-1.5 bg-violet-500/20 rounded-full">{uploadPercentage}% Uploaded</div>
        </div>
      </div>
      <div className="grow">
        <BarChart data={chartData} width={595} height={248} />
      </div>
    </div>
  );
}

