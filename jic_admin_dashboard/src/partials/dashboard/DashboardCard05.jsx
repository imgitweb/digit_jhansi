import React from 'react';
import { useNavigate } from 'react-router-dom';
import LineChart from '../../charts/LineChart02';
import { getCssVariable } from '../../utils/Utils';

export default function DashboardCard05({ data, loading }) {
  const navigate = useNavigate();

  if (loading || !data) {
    return <div className="col-span-full sm:col-span-6 bg-gray-200 dark:bg-gray-700 animate-pulse h-[320px] rounded-xl"></div>;
  }

  const chartData = {
    labels: data.labels12m,
    datasets: [
      {
        label: 'Total',
        data: data.plus50L.history12m,
        borderColor: getCssVariable('--color-violet-500'),
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-violet-500'),
        pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      {
        label: 'Ecommerce Enabled',
        data: data.plus50L.ecommerceEnabled12m,
        borderColor: getCssVariable('--color-sky-500'),
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-sky-500'),
        pointHoverBackgroundColor: getCssVariable('--color-sky-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      {
        label: 'Exporting',
        data: data.plus50L.exporting12m,
        borderColor: getCssVariable('--color-green-500'),
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-green-500'),
        pointHoverBackgroundColor: getCssVariable('--color-green-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div 
      onClick={() => navigate('/industries-50lplus')}
      className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl cursor-pointer hover:shadow-md transition-shadow relative"
    >
      {data.plus50L.error && <span className="absolute top-2 right-2 text-xs text-red-500 font-semibold">API Error</span>}
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Industry Pool (50L+)</h2>
        <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${data.plus50L.thisMonth > 0 ? 'text-green-700 bg-green-500/20' : 'text-gray-500 bg-gray-500/20'}`}>
          +{data.plus50L.thisMonth} this month
        </div>
      </header>
      <div className="px-5 mt-2">
        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{data.plus50L.total}</div>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Enterprise Businesses</div>
      </div>
      <div className="grow">
        <LineChart data={chartData} width={595} height={248} />
      </div>
    </div>
  );
}

