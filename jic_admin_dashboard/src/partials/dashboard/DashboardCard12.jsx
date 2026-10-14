import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardCard12({ data, loading }) {
  const navigate = useNavigate();

  if (loading || !data) {
    return <div className="col-span-full xl:col-span-6 bg-gray-200 dark:bg-gray-700 animate-pulse h-[360px] rounded-xl"></div>;
  }

  const todayStr = new Date().toDateString();
  const activityFeed = data?.activityFeed ?? [];
  const todayItems = activityFeed.filter((item) => item?._createdAt?.toDateString() === todayStr);
  const earlierItems = activityFeed.filter((item) => item?._createdAt?.toDateString() !== todayStr);

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

  const getIconColor = (modKey) => {
    switch(modKey) {
      case 'resources': return 'bg-green-500';
      case 'riders': return 'bg-sky-500';
      case 'enablers': return 'bg-gray-500';
      default: return 'bg-violet-500';
    }
  };

  const renderFeedItem = (item) => {
    const name = item?._displayName ?? 'Unknown';
    const modMap = { resources: 'Resource Hub', riders: 'Riders Database', enablers: 'Ecommerce Enablers', under50L: 'Industry (<50L)', plus50L: 'Industry (50L+)' };
    return (
      <li key={item?._id ?? `${item?._moduleKey}-${item?._contactValue}`} className="flex px-2">
        <div className={`w-9 h-9 rounded-full shrink-0 ${getIconColor(item?._moduleKey)} my-2 mr-3 flex items-center justify-center`}>
          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 36 36"><path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" /></svg>
        </div>
        <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
          <div className="grow flex justify-between">
            <div className="self-center">
              <span className="font-medium text-gray-800 dark:text-gray-100">{name}</span> was added to <span className="font-medium text-gray-800 dark:text-gray-100">{modMap[item?._moduleKey] ?? 'Module'}</span> via {item?.registrationSource ?? 'Unknown Source'}
            </div>
            <div className="shrink-0 self-end ml-2">
              <button onClick={() => navigate(getPath(item?._moduleKey))} className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400">View<span className="hidden sm:inline"> -&gt;</span></button>
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h2>
      </header>
      <div className="p-3">
        {todayItems.length > 0 && (
          <div>
            <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">Today</header>
            <ul className="my-1">{todayItems.map(renderFeedItem)}</ul>
          </div>
        )}
        {earlierItems.length > 0 && (
          <div className={todayItems.length > 0 ? "mt-4" : ""}>
            <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">Earlier</header>
            <ul className="my-1">{earlierItems.map(renderFeedItem)}</ul>
          </div>
        )}
        {activityFeed.length === 0 && <p className="text-center text-sm text-gray-500 p-4">No recent activity.</p>}
      </div>
    </div>
  );
}

