import React from 'react';
import DoughnutChart from '../../charts/DoughnutChart';
import { getCssVariable } from '../../utils/Utils';

export default function DashboardCard06({ data, loading }) {
  if (loading || !data) {
    return <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-gray-200 dark:bg-gray-700 animate-pulse h-[360px] rounded-xl"></div>;
  }

  const distribution = data?.moduleDistribution ?? [];
  const chartData = {
    labels: distribution.map((item) => item?.label ?? ''),
    datasets: [
      {
        label: 'Total Registered',
        data: distribution.map((item) => item?.value ?? 0),
        backgroundColor: distribution.map((item) => getCssVariable(item?.colorToken ?? '--color-gray-500')),
        hoverBackgroundColor: distribution.map((item) => getCssVariable(item?.hoverColorToken ?? '--color-gray-600')),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Module Distribution</h2>
      </header>
      <div className="p-3 grow flex flex-col justify-center">
        <DoughnutChart data={chartData} width={389} height={260} />
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
          {distribution.map((item, index) => (
            <div key={item?.key ?? index} className="flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}></span>
              <span className="truncate">{item?.label ?? '-'}</span>
              <span className="ml-auto font-medium text-gray-800 dark:text-gray-100">
                {(data?.grandTotal ?? 0) > 0 ? Math.round(((chartData.datasets[0].data[index] ?? 0) / (data?.grandTotal ?? 0)) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


