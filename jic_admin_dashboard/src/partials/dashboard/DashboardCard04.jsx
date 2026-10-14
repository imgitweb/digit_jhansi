import React from 'react';
import { useNavigate } from 'react-router-dom';
import BarChart from '../../charts/BarChart01';
import { getCssVariable } from '../../utils/Utils';

export default function DashboardCard04({ data, loading }) {
  const navigate = useNavigate();

  if (loading || !data) {
    return <div className="col-span-full sm:col-span-6 bg-gray-200 dark:bg-gray-700 animate-pulse h-[320px] rounded-xl"></div>;
  }

  const chartData = {
    labels: data.labels6m,
    datasets: [
      {
        label: 'Active',
        data: data.under50L.history6mActive,
        backgroundColor: getCssVariable('--color-sky-500'),
        hoverBackgroundColor: getCssVariable('--color-sky-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
      {
        label: 'Inactive & Verified',
        data: data.under50L.history6mInactiveVerified,
        backgroundColor: getCssVariable('--color-violet-500'),
        hoverBackgroundColor: getCssVariable('--color-violet-600'),
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div 
      onClick={() => navigate('/industries-under50l')}
      className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl cursor-pointer hover:shadow-md transition-shadow relative"
    >
      {data.under50L.error && <span className="absolute top-2 right-2 text-xs text-red-500 font-semibold">API Error</span>}
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Industry Pool (Under ₹50L)</h2>
        <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${data.under50L.thisMonth > 0 ? 'text-green-700 bg-green-500/20' : 'text-gray-500 bg-gray-500/20'}`}>
          +{data.under50L.thisMonth} this month
        </div>
      </header>
      <div className="px-5 mt-2">
        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{data.under50L.total}</div>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Total Businesses</div>
      </div>
      <div className="grow">
        <BarChart data={chartData} width={595} height={248} />
      </div>
    </div>
  );
}


