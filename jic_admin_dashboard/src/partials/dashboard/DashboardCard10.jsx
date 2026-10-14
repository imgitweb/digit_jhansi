import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardCard10({ data, loading }) {
  const navigate = useNavigate();

  if (loading || !data) {
    return <div className="col-span-full xl:col-span-6 bg-gray-200 dark:bg-gray-700 animate-pulse h-[360px] rounded-xl"></div>;
  }

  const getModuleBadge = (modKey) => {
    switch(modKey) {
      case 'resources': return <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Resources</span>;
      case 'riders': return <span className="text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full">Riders</span>;
      case 'enablers': return <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Enablers</span>;
      default: return <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">Industry</span>;
    }
  };

  const getPath = (modKey) => {
    switch(modKey) {
      case 'resources': return '/resources';
      case 'riders': return '/riders';
      case 'enablers': return '/enablers';
      case 'under50L': return '/industries-under50l';
      case 'plus50L': return '/industries-50lplus';
      default: return '/';
    }
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Registrations</h2>
      </header>      
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Name</div></th>
                <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Module</div></th>
                <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Contact</div></th>
                <th className="p-2 whitespace-nowrap"><div className="font-semibold text-center">Registered</div></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {(data?.recentAll ?? []).length > 0 ? (data?.recentAll ?? []).map(record => {
                const name = record?._displayName ?? 'Unknown';
                return (
                  <tr key={record?._id ?? `${record?._moduleKey}-${record?._contactValue}`} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition" onClick={() => navigate(getPath(record?._moduleKey))}>
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 shrink-0 mr-2 sm:mr-3 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[120px]">{name}</div>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap"><div className="text-left">{getModuleBadge(record?._moduleKey)}</div></td>
                    <td className="p-2 whitespace-nowrap"><div className="text-left text-gray-500">{record?._contactValue ?? '-'}</div></td>
                    <td className="p-2 whitespace-nowrap"><div className="text-center">{record?._createdAt ? record._createdAt.toLocaleDateString() : '-'}</div></td>
                  </tr>
                )
              }) : (
                <tr><td colSpan="4" className="p-4 text-center text-gray-500">No recent records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


