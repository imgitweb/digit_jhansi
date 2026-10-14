import React from 'react';
import { useNavigate } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

export default function DashboardCard03({ data, loading }) {
  const navigate = useNavigate();

  if (loading || !data) {
    return <div className="col-span-full sm:col-span-6 xl:col-span-4 bg-gray-200 dark:bg-gray-700 animate-pulse h-[240px] rounded-xl"></div>;
  }

  const chartData = {
    labels: data.labels12m,
    datasets: [
      {
        data: data.enablers.history12m,
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-green-500'), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-green-500'), 0.2) }
          ]);
        },       
        borderColor: getCssVariable('--color-green-500'),
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
      {
        data: data.enablers.prevHistory12m,
        borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
        pointHoverBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div 
      onClick={() => navigate('/enablers')}
      className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl cursor-pointer hover:shadow-md transition-shadow relative"
    >
      {data.enablers.error && <span className="absolute top-2 right-2 text-xs text-red-500 font-semibold">API Error</span>}
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Ecommerce Enablers</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">TOTAL REGISTERED</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">{data.enablers.total}</div>
          <div className={`text-sm font-medium px-1.5 rounded-full ${data.enablers.thisMonth > 0 ? 'text-green-700 bg-green-500/20' : 'text-gray-500 bg-gray-500/20'}`}>
            +{data.enablers.thisMonth} this month
          </div>
        </div>
      </div>
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}




