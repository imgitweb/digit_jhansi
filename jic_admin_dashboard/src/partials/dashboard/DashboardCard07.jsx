import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardCard07({ data, loading }) {
  const navigate = useNavigate();

  if (loading || !data) {
    return <div className="col-span-full xl:col-span-8 bg-gray-200 dark:bg-gray-700 animate-pulse h-[360px] rounded-xl"></div>;
  }

  const modules = [
    { key: 'resources', path: '/resources', icon: <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" fill="#8470ff" /> },
    { key: 'riders', path: '/riders', icon: <path d="M6.753 2.659a1 1 0 0 0-1.506-1.317L2.451 4.537l-.744-.744A1 1 0 1 0 .293 5.207l1.5 1.5a1 1 0 0 0 1.46-.048l3.5-4ZM6.753 10.659a1 1 0 1 0-1.506-1.317l-2.796 3.195-.744-.744a1 1 0 0 0-1.414 1.414l1.5 1.5a1 1 0 0 0 1.46-.049l3.5-4ZM8 4.5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1ZM9 11.5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" fill="#56b1f3" /> },
    { key: 'enablers', path: '/enablers', icon: <path d="M9 6.855A3.502 3.502 0 0 0 8 0a3.5 3.5 0 0 0-1 6.855v1.656L5.534 9.65a3.5 3.5 0 1 0 1.229 1.578L8 10.267l1.238.962a3.5 3.5 0 1 0 1.229-1.578L9 8.511V6.855ZM6.5 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4.803 8.095c.005-.005.01-.01.013-.016l.012-.016a1.5 1.5 0 1 1-.025.032ZM3.5 11c.474 0 .897.22 1.171.563l.013.016.013.017A1.5 1.5 0 1 1 3.5 11Z" fill="#3ec972" /> },
    { key: 'under50L', path: '/industries-under50l', icon: <path d="M14.75 2.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM14.75 16a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM2.5 14.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM1.25 2.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" fill="#4634b1" /> },
    { key: 'plus50L', path: '/industries-50lplus', icon: <path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2ZM4 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" fill="#7bc8ff" /> },
  ].map((moduleItem) => {
    const overviewItem = (data?.moduleOverview ?? []).find((entry) => entry?.key === moduleItem.key);
    return {
      ...moduleItem,
      name: overviewItem?.name ?? moduleItem.key,
      stats: overviewItem?.stats ?? { total: 0, active: 0, thisMonth: 0 },
    };
  });

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Module Overview</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
              <tr>
                <th className="p-2"><div className="font-semibold text-left">Module</div></th>
                <th className="p-2"><div className="font-semibold text-center">Total</div></th>
                <th className="p-2"><div className="font-semibold text-center">Active</div></th>
                <th className="p-2"><div className="font-semibold text-center">This Month</div></th>
                <th className="p-2"><div className="font-semibold text-center">Status</div></th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {modules.map((mod, index) => (
                <tr key={index} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition" onClick={() => navigate(mod.path)}>
                  <td className="p-2">
                    <div className="flex items-center">
                      <svg className="shrink-0 mr-2 sm:mr-3" width="24" height="24" viewBox="0 0 16 16">
                        {mod.icon}
                      </svg>
                      <div className="text-gray-800 dark:text-gray-100">{mod.name}</div>
                    </div>
                  </td>
                  <td className="p-2"><div className="text-center">{mod.stats.total}</div></td>
                  <td className="p-2"><div className="text-center text-green-500">{mod.stats.active}</div></td>
                  <td className="p-2"><div className="text-center">+{mod.stats.thisMonth}</div></td>
                  <td className="p-2">
                    <div className="text-center">
                      {mod.stats.total > 0 
                        ? <span className="px-2 py-1 bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400 rounded-full text-xs">Healthy</span>
                        : <span className="px-2 py-1 bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs">Empty</span>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



