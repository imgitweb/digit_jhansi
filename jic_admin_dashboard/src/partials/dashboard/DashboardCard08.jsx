import React from 'react';
import { getCssVariable } from '../../utils/Utils';
import LineChart from '../../charts/LineChart02';

export default function DashboardCard08({ data, loading }) {
  if (loading || !data) {
    return <div className="col-span-full sm:col-span-6 bg-gray-200 dark:bg-gray-700 animate-pulse h-[320px] rounded-xl"></div>;
  }

  const chartData = {
    labels: data.labels12m,
    datasets: [
      {
        label: 'Resources',
        data: data.resources.history12m,
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
        label: 'Riders',
        data: data.riders.history12m,
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
        label: 'Industries (All)',
        data: data.combinedHistory12m,
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
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Registrations Over Time (All Modules)</h2>
      </header>
      <div className="grow">
        <LineChart data={chartData} width={595} height={248} />
      </div>
    </div>
  );
}

