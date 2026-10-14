import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardCard13({ data, loading }) {
  const navigate = useNavigate();

  if (loading || !data) {
    return <div className="col-span-full xl:col-span-6 bg-gray-200 dark:bg-gray-700 animate-pulse h-[360px] rounded-xl"></div>;
  }

  const modules = [
    { key: 'resources', path: '/resources' },
    { key: 'riders', path: '/riders' },
    { key: 'enablers', path: '/enablers' },
    { key: 'under50L', path: '/industries-under50l' },
    { key: 'plus50L', path: '/industries-50lplus' },
  ].map((moduleItem) => {
    const overviewItem = (data?.moduleOverview ?? []).find((entry) => entry?.key === moduleItem.key);
    return {
      ...moduleItem,
      name: overviewItem?.name ?? moduleItem.key,
      stats: overviewItem?.stats ?? { totalExcel: 0, totalManual: 0 },
    };
  });

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Data Ingestion Summary</h2>
      </header>
      <div className="p-3">
        
        {/* Excel Uploads Group */}
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">Excel Uploads</header>
          <ul className="my-1">
            {modules.map(mod => (
              <li key={`excel-${mod.key}`} className="flex px-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" onClick={() => navigate(mod.path)}>
                <div className="w-9 h-9 rounded-full shrink-0 bg-green-500 my-2 mr-3 flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 36 36"><path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" /></svg>
                </div>
                <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                  <div className="grow flex justify-between">
                    <div className="self-center font-medium text-gray-800 dark:text-gray-100">{mod.name}</div>
                    <div className="shrink-0 self-start ml-2">
                      <span className="font-medium text-green-600">+{mod?.stats?.totalExcel ?? 0}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Manual Entries Group */}
        <div className="mt-4">
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">Manual Entries</header>
          <ul className="my-1">
            {modules.map(mod => (
              <li key={`manual-${mod.key}`} className="flex px-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" onClick={() => navigate(mod.path)}>
                <div className="w-9 h-9 rounded-full shrink-0 bg-gray-400 my-2 mr-3 flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 36 36"><path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" /></svg>
                </div>
                <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                  <div className="grow flex justify-between">
                    <div className="self-center font-medium text-gray-800 dark:text-gray-100">{mod.name}</div>
                    <div className="shrink-0 self-start ml-2">
                      <span className="font-medium text-gray-500">+{mod?.stats?.totalManual ?? 0}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}


