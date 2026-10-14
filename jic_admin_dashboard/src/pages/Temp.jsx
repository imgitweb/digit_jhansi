// Dashboard Previous

// import React, { useState } from 'react';

// import Sidebar from '../partials/Sidebar';
// import Header from '../partials/Header';
// import FilterButton from '../components/DropdownFilter';
// import Datepicker from '../components/Datepicker';
// import DashboardCard01 from '../partials/dashboard/DashboardCard01';
// import DashboardCard02 from '../partials/dashboard/DashboardCard02';
// import DashboardCard03 from '../partials/dashboard/DashboardCard03';
// import DashboardCard04 from '../partials/dashboard/DashboardCard04';
// import DashboardCard05 from '../partials/dashboard/DashboardCard05';
// import DashboardCard06 from '../partials/dashboard/DashboardCard06';
// import DashboardCard07 from '../partials/dashboard/DashboardCard07';
// import DashboardCard08 from '../partials/dashboard/DashboardCard08';
// import DashboardCard09 from '../partials/dashboard/DashboardCard09';
// import DashboardCard10 from '../partials/dashboard/DashboardCard10';
// import DashboardCard11 from '../partials/dashboard/DashboardCard11';
// import DashboardCard12 from '../partials/dashboard/DashboardCard12';
// import DashboardCard13 from '../partials/dashboard/DashboardCard13';

// function Dashboard() {

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen overflow-hidden">

//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       {/* Content area */}
//       <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

//         {/*  Site header */}
//         <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//         <main className="grow">
//           <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

//             {/* Dashboard actions */}
//             <div className="sm:flex sm:justify-between sm:items-center mb-8">

//               {/* Left: Title */}
//               <div className="mb-4 sm:mb-0">
//                 <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
//               </div>

//               {/* Right: Actions */}
//               <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
//                 {/* Filter button */}
//                 <FilterButton align="right" />
//                 {/* Datepicker built with React Day Picker */}
//                 <Datepicker align="right" />
//                 {/* Add view button */}
//                 <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
//                   <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
//                     <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
//                   </svg>
//                   <span className="max-xs:sr-only">Add View</span>
//                 </button>                
//               </div>

//             </div>

//             {/* Cards */}
//             <div className="grid grid-cols-12 gap-6">

//               {/* Line - 1 */}

//               {/* Line chart (Acme Plus) */}
//               <DashboardCard01 />
//               {/* Line chart (Acme Advanced) */}
//               <DashboardCard02 />
//               {/* Line chart (Acme Professional) */}
//               <DashboardCard03 />

//               {/* Line - 2 */}

//               {/* Bar chart (Direct vs Indirect) */}
//               <DashboardCard04 />
//               {/* Line chart (Real Time Value) */}
//               <DashboardCard05 />

//               {/* Line - 3  */}
//               {/* Doughnut chart (Top Countries) */}
//               <DashboardCard06 />
//               {/* Table (Top Channels) */}
//               <DashboardCard07 />

//               {/* Line - 4 */}
//               {/* Line chart (Sales Over Time) */}
//               <DashboardCard08 />
//               {/* Stacked bar chart (Sales VS Refunds) */}
//               <DashboardCard09 />

//               {/* Line - 5 */}
//               {/* Card (Customers) */}
//               <DashboardCard10 />
//               {/* Card (Reasons for Refunds) */}
//               <DashboardCard11 />

//               {/* Line - 6 */}
//               {/* Card (Recent Activity) */}
//               <DashboardCard12 />
//               {/* Card (Income/Expenses) */}
//               <DashboardCard13 /> 
              
//             </div>

//           </div>
//         </main>


//       </div>
//     </div>
//   );
// }

// export default Dashboard;


// ################## Card01  ###################





// import React from 'react';
// import { Link } from 'react-router-dom';
// import LineChart from '../../charts/LineChart01';
// import { chartAreaGradient } from '../../charts/ChartjsConfig';
// import EditMenu from '../../components/DropdownEditMenu';

// // Import utilities
// import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

// function DashboardCard01() {

//   const chartData = {
//     labels: [
//       '12-01-2022',
//       '01-01-2023',
//       '02-01-2023',
//       '03-01-2023',
//       '04-01-2023',
//       '05-01-2023',
//       '06-01-2023',
//       '07-01-2023',
//       '08-01-2023',
//       '09-01-2023',
//       '10-01-2023',
//       '11-01-2023',
//       '12-01-2023',
//       '01-01-2024',
//       '02-01-2024',
//       '03-01-2024',
//       '04-01-2024',
//       '05-01-2024',
//       '06-01-2024',
//       '07-01-2024',
//       '08-01-2024',
//       '09-01-2024',
//       '10-01-2024',
//       '11-01-2024',
//       '12-01-2024',
//       '01-01-2025',
//     ],
//     datasets: [
//       // Indigo line
//       {
//         data: [732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192, 154, 273, 191, 191, 126, 263, 349, 252, 423, 622, 470, 532],
//         fill: true,
//         backgroundColor: function(context) {
//           const chart = context.chart;
//           const {ctx, chartArea} = chart;
//           return chartAreaGradient(ctx, chartArea, [
//             { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
//             { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) }
//           ]);
//         },            
//         borderColor: getCssVariable('--color-violet-500'),
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: getCssVariable('--color-violet-500'),
//         pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,
//         clip: 20,
//         tension: 0.2,
//       },
//       // Gray line
//       {
//         data: [532, 532, 532, 404, 404, 314, 314, 314, 314, 314, 234, 314, 234, 234, 314, 314, 314, 388, 314, 202, 202, 202, 202, 314, 720, 642],
//         borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
//         pointHoverBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,
//         clip: 20,
//         tension: 0.2,
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <div className="px-5 pt-5">
//         <header className="flex justify-between items-start mb-2">
//           <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Acme Plus</h2>
//           {/* Menu button */}
//           <EditMenu align="right" className="relative inline-flex">
//             <li>
//               <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
//                 Option 1
//               </Link>
//             </li>
//             <li>
//               <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
//                 Option 2
//               </Link>
//             </li>
//             <li>
//               <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3" to="#0">
//                 Remove
//               </Link>
//             </li>
//           </EditMenu>
//         </header>
//         <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Sales</div>
//         <div className="flex items-start">
//           <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">$24,780</div>
//           <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">+49%</div>
//         </div>
//       </div>
//       {/* Chart built with Chart.js 3 */}
//       <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
//         {/* Change the height attribute to adjust the chart height */}
//         <LineChart data={chartData} width={389} height={128} />
//       </div>
//     </div>
//   );
// }

// export default DashboardCard01;



// ################## Card02  ###################

// import React from 'react';
// import { Link } from 'react-router-dom';
// import LineChart from '../../charts/LineChart01';
// import { chartAreaGradient } from '../../charts/ChartjsConfig';
// import EditMenu from '../../components/DropdownEditMenu';

// // Import utilities
// import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

// function DashboardCard02() {

//   const chartData = {
//     labels: [
//       '12-01-2022', '01-01-2023', '02-01-2023',
//       '03-01-2023', '04-01-2023', '05-01-2023',
//       '06-01-2023', '07-01-2023', '08-01-2023',
//       '09-01-2023', '10-01-2023', '11-01-2023',
//       '12-01-2023', '01-01-2024', '02-01-2024',
//       '03-01-2024', '04-01-2024', '05-01-2024',
//       '06-01-2024', '07-01-2024', '08-01-2024',
//       '09-01-2024', '10-01-2024', '11-01-2024',
//       '12-01-2024', '01-01-2025',
//     ],
//     datasets: [
//       // Indigo line
//       {
//         data: [
//           622, 622, 426, 471, 365, 365, 238,
//           324, 288, 206, 324, 324, 500, 409,
//           409, 273, 232, 273, 500, 570, 767,
//           808, 685, 767, 685, 685,
//         ],
//         fill: true,
//         backgroundColor: function(context) {
//           const chart = context.chart;
//           const {ctx, chartArea} = chart;
//           return chartAreaGradient(ctx, chartArea, [
//             { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
//             { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) }
//           ]);
//         },       
//         borderColor: getCssVariable('--color-violet-500'),
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: getCssVariable('--color-violet-500'),
//         pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,          
//         clip: 20,
//         tension: 0.2,
//       },
//       // Gray line
//       {
//         data: [
//           732, 610, 610, 504, 504, 504, 349,
//           349, 504, 342, 504, 610, 391, 192,
//           154, 273, 191, 191, 126, 263, 349,
//           252, 423, 622, 470, 532,
//         ],
//         borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
//         pointHoverBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,
//         clip: 20,
//         tension: 0.2,
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <div className="px-5 pt-5">
//         <header className="flex justify-between items-start mb-2">
//           <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Acme Advanced</h2>
//           {/* Menu button */}
//           <EditMenu align="right" className="relative inline-flex">
//             <li>
//               <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
//                 Option 1
//               </Link>
//             </li>
//             <li>
//               <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
//                 Option 2
//               </Link>
//             </li>
//             <li>
//               <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3" to="#0">
//                 Remove
//               </Link>
//             </li>
//           </EditMenu>
//         </header>
//         <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Sales</div>
//         <div className="flex items-start">
//           <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">$17,489</div>
//           <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">-14%</div>
//         </div>
//       </div>
//       {/* Chart built with Chart.js 3 */}
//       <div className="grow max-sm:max-h-[128px] max-h-[128px]">
//         {/* Change the height attribute to adjust the chart height */}
//         <LineChart data={chartData} width={389} height={128} />
//       </div>
//     </div>
//   );
// }

// export default DashboardCard02;



// ################## Card03  ###################
// import React from 'react';
// import { Link } from 'react-router-dom';
// import LineChart from '../../charts/LineChart01';
// import { chartAreaGradient } from '../../charts/ChartjsConfig';
// import EditMenu from '../../components/DropdownEditMenu';

// // Import utilities
// import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

// function DashboardCard03() {

//   const chartData = {
//     labels: [
//       '12-01-2022', '01-01-2023', '02-01-2023',
//       '03-01-2023', '04-01-2023', '05-01-2023',
//       '06-01-2023', '07-01-2023', '08-01-2023',
//       '09-01-2023', '10-01-2023', '11-01-2023',
//       '12-01-2023', '01-01-2024', '02-01-2024',
//       '03-01-2024', '04-01-2024', '05-01-2024',
//       '06-01-2024', '07-01-2024', '08-01-2024',
//       '09-01-2024', '10-01-2024', '11-01-2024',
//       '12-01-2024', '01-01-2025',
//     ],
//     datasets: [
//       // Indigo line
//       {
//         data: [
//           540, 466, 540, 466, 385, 432, 334,
//           334, 289, 289, 200, 289, 222, 289,
//           289, 403, 554, 304, 289, 270, 134,
//           270, 829, 344, 388, 364,
//         ],
//         fill: true,
//         backgroundColor: function(context) {
//           const chart = context.chart;
//           const {ctx, chartArea} = chart;
//           return chartAreaGradient(ctx, chartArea, [
//             { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
//             { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) }
//           ]);
//         },       
//         borderColor: getCssVariable('--color-violet-500'),
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: getCssVariable('--color-violet-500'),
//         pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,          
//         clip: 20,
//         tension: 0.2,
//       },
//       // Gray line
//       {
//         data: [
//           689, 562, 477, 477, 477, 477, 458,
//           314, 430, 378, 430, 498, 642, 350,
//           145, 145, 354, 260, 188, 188, 300,
//           300, 282, 364, 660, 554,
//         ],
//         borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
//         pointHoverBackgroundColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,
//         clip: 20,
//         tension: 0.2,
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <div className="px-5 pt-5">
//         <header className="flex justify-between items-start mb-2">
//           <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Acme Professional</h2>
//           {/* Menu button */}
//           <EditMenu align="right" className="relative inline-flex">
//             <li>
//               <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
//                 Option 1
//               </Link>
//             </li>
//             <li>
//               <Link className="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3" to="#0">
//                 Option 2
//               </Link>
//             </li>
//             <li>
//               <Link className="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3" to="#0">
//                 Remove
//               </Link>
//             </li>
//           </EditMenu>
//         </header>
//         <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Sales</div>
//         <div className="flex items-start">
//           <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">$9,962</div>
//           <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">+49%</div>
//         </div>
//       </div>
//       {/* Chart built with Chart.js 3 */}
//       <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
//         {/* Change the height attribute to adjust the chart height */}
//         <LineChart data={chartData} width={389} height={128} />
//       </div>
//     </div>
//   );
// }

// export default DashboardCard03;



// ################## Card04  ###################

// import React from 'react';
// import BarChart from '../../charts/BarChart01';

// // Import utilities
// import { getCssVariable } from '../../utils/Utils';

// function DashboardCard04() {

//   const chartData = {
//     labels: [
//       '12-01-2022', '01-01-2023', '02-01-2023',
//       '03-01-2023', '04-01-2023', '05-01-2023',
//     ],
//     datasets: [
//       // Light blue bars
//       {
//         label: 'Direct',
//         data: [
//           800, 1600, 900, 1300, 1950, 1700,
//         ],
//         backgroundColor: getCssVariable('--color-sky-500'),
//         hoverBackgroundColor: getCssVariable('--color-sky-600'),
//         barPercentage: 0.7,
//         categoryPercentage: 0.7,
//         borderRadius: 4,
//       },
//       // Blue bars
//       {
//         label: 'Indirect',
//         data: [
//           4900, 2600, 5350, 4800, 5200, 4800,
//         ],
//         backgroundColor: getCssVariable('--color-violet-500'),
//         hoverBackgroundColor: getCssVariable('--color-violet-600'),
//         barPercentage: 0.7,
//         categoryPercentage: 0.7,
//         borderRadius: 4,
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100">Direct VS Indirect</h2>
//       </header>
//       {/* Chart built with Chart.js 3 */}
//       {/* Change the height attribute to adjust the chart height */}
//       <BarChart data={chartData} width={595} height={248} />
//     </div>
//   );
// }

// export default DashboardCard04;


// ################## Card05  ###################
// import React, { useState, useEffect } from 'react';
// import Tooltip from '../../components/Tooltip';
// import { chartAreaGradient } from '../../charts/ChartjsConfig';
// import RealtimeChart from '../../charts/RealtimeChart';

// // Import utilities
// import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

// function DashboardCard05() {

//   // IMPORTANT:
//   // Code below is for demo purpose only, and it's not covered by support.
//   // If you need to replace dummy data with real data,
//   // refer to Chart.js documentation: https://www.chartjs.org/docs/latest

//   // Fake real-time data
//   const [counter, setCounter] = useState(0);
//   const [increment, setIncrement] = useState(0);
//   const [range, setRange] = useState(35);
  
//   // Dummy data to be looped
//   const data = [
//     57.81, 57.75, 55.48, 54.28, 53.14, 52.25, 51.04, 52.49, 55.49, 56.87,
//     53.73, 56.42, 58.06, 55.62, 58.16, 55.22, 58.67, 60.18, 61.31, 63.25,
//     65.91, 64.44, 65.97, 62.27, 60.96, 59.34, 55.07, 59.85, 53.79, 51.92,
//     50.95, 49.65, 48.09, 49.81, 47.85, 49.52, 50.21, 52.22, 54.42, 53.42,
//     50.91, 58.52, 53.37, 57.58, 59.09, 59.36, 58.71, 59.42, 55.93, 57.71,
//     50.62, 56.28, 57.37, 53.08, 55.94, 55.82, 53.94, 52.65, 50.25,
//   ];

//   const [slicedData, setSlicedData] = useState(data.slice(0, range));

//   // Generate fake dates from now to back in time
//   const generateDates = () => {
//     const now = new Date();
//     const dates = [];
//     data.forEach((v, i) => {
//       dates.push(new Date(now - 2000 - i * 2000));
//     });
//     return dates;
//   };

//   const [slicedLabels, setSlicedLabels] = useState(generateDates().slice(0, range).reverse());

//   // Fake update every 2 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCounter(counter + 1);
//     }, 2000);
//     return () => clearInterval(interval)
//   }, [counter]);

//   // Loop through data array and update
//   useEffect(() => {
//     setIncrement(increment + 1);
//     if (increment + range < data.length) {
//       setSlicedData(([x, ...slicedData]) => [...slicedData, data[increment + range]]);
//     } else {
//       setIncrement(0);
//       setRange(0);
//     }
//     setSlicedLabels(([x, ...slicedLabels]) => [...slicedLabels, new Date()]);
//     return () => setIncrement(0)
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [counter]);

//   const chartData = {
//     labels: slicedLabels,
//     datasets: [
//       // Indigo line
//       {
//         data: slicedData,
//         fill: true,
//         backgroundColor: function(context) {
//           const chart = context.chart;
//           const {ctx, chartArea} = chart;
//           return chartAreaGradient(ctx, chartArea, [
//             { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
//             { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) }
//           ]);
//         },       
//         borderColor: getCssVariable('--color-violet-500'),
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: getCssVariable('--color-violet-500'),
//         pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,          
//         clip: 20,
//         tension: 0.2,
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100">Real Time Value</h2>
//         <Tooltip className="ml-2">
//           <div className="text-xs text-center whitespace-nowrap">Built with <a className="underline" href="https://www.chartjs.org/" target="_blank" rel="noreferrer">Chart.js</a></div>
//         </Tooltip>
//       </header>
//       {/* Chart built with Chart.js 3 */}
//       {/* Change the height attribute to adjust the chart height */}
//       <RealtimeChart data={chartData} width={595} height={248} />
//     </div>
//   );
// }

// export default DashboardCard05;



// ################## Card06  ###################
// import React from 'react';
// import DoughnutChart from '../../charts/DoughnutChart';

// // Import utilities
// import { getCssVariable } from '../../utils/Utils';

// function DashboardCard06() {

//   const chartData = {
//     labels: ['United States', 'Italy', 'Other'],
//     datasets: [
//       {
//         label: 'Top Countries',
//         data: [
//           35, 30, 35,
//         ],
//         backgroundColor: [
//           getCssVariable('--color-violet-500'),
//           getCssVariable('--color-sky-500'),
//           getCssVariable('--color-violet-800'),
//         ],
//         hoverBackgroundColor: [
//           getCssVariable('--color-violet-600'),
//           getCssVariable('--color-sky-600'),
//           getCssVariable('--color-violet-900'),
//         ],
//         borderWidth: 0,
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100">Top Countries</h2>
//       </header>
//       {/* Chart built with Chart.js 3 */}
//       {/* Change the height attribute to adjust the chart height */}
//       <DoughnutChart data={chartData} width={389} height={260} />
//     </div>
//   );
// }

// export default DashboardCard06;




// ################## Card07  ###################
// import React from 'react';

// function DashboardCard07() {
//   return (
//     <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100">Top Channels</h2>
//       </header>
//       <div className="p-3">
//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="table-auto w-full dark:text-gray-300">
//             {/* Table header */}
//             <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
//               <tr>
//                 <th className="p-2">
//                   <div className="font-semibold text-left">Source</div>
//                 </th>
//                 <th className="p-2">
//                   <div className="font-semibold text-center">Visitors</div>
//                 </th>
//                 <th className="p-2">
//                   <div className="font-semibold text-center">Revenues</div>
//                 </th>
//                 <th className="p-2">
//                   <div className="font-semibold text-center">Sales</div>
//                 </th>
//                 <th className="p-2">
//                   <div className="font-semibold text-center">Conversion</div>
//                 </th>
//               </tr>
//             </thead>
//             {/* Table body */}
//             <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
//               {/* Row */}
//               <tr>
//                 <td className="p-2">
//                   <div className="flex items-center">
//                     <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
//                       <circle fill="#24292E" cx="18" cy="18" r="18" />
//                       <path
//                         d="M18 10.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V24c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"
//                         fill="#FFF"
//                       />
//                     </svg>
//                     <div className="text-gray-800 dark:text-gray-100">Github.com</div>
//                   </div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center">2.4K</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center text-green-500">$3,877</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center">267</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center text-sky-500">4.7%</div>
//                 </td>
//               </tr>
//               {/* Row */}
//               <tr>
//                 <td className="p-2">
//                   <div className="flex items-center">
//                     <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
//                       <circle fill="#1877F2" cx="18" cy="18" r="18" />
//                       <path
//                         d="M16.023 26 16 19h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V16H23l-1 3h-2.72v7h-3.257Z"
//                         fill="#FFF"
//                         fillRule="nonzero"
//                       />
//                     </svg>
//                     <div className="text-gray-800 dark:text-gray-100">Facebook</div>
//                   </div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center">2.2K</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center text-green-500">$3,426</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center">249</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center text-sky-500">4.4%</div>
//                 </td>
//               </tr>
//               {/* Row */}
//               <tr>
//                 <td className="p-2">
//                   <div className="flex items-center">
//                     <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
//                       <circle fill="#EA4335" cx="18" cy="18" r="18" />
//                       <path
//                         d="M18 17v2.4h4.1c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C21.6 11.7 20 11 18.1 11c-3.9 0-7 3.1-7 7s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H18z"
//                         fill="#FFF"
//                         fillRule="nonzero"
//                       />
//                     </svg>
//                     <div className="text-gray-800 dark:text-gray-100">Google (organic)</div>
//                   </div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center">2.0K</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center text-green-500">$2,444</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center">224</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center text-sky-500">4.2%</div>
//                 </td>
//               </tr>
//               {/* Row */}
//               <tr>
//                 <td className="p-2">
//                   <div className="flex items-center">
//                     <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
//                       <circle fill="#4BC9FF" cx="18" cy="18" r="18" />
//                       <path
//                         d="M26 14.3c-.1 1.6-1.2 3.7-3.3 6.4-2.2 2.8-4 4.2-5.5 4.2-.9 0-1.7-.9-2.4-2.6C14 19.9 13.4 15 12 15c-.1 0-.5.3-1.2.8l-.8-1c.8-.7 3.5-3.4 4.7-3.5 1.2-.1 2 .7 2.3 2.5.3 2 .8 6.1 1.8 6.1.9 0 2.5-3.4 2.6-4 .1-.9-.3-1.9-2.3-1.1.8-2.6 2.3-3.8 4.5-3.8 1.7.1 2.5 1.2 2.4 3.3z"
//                         fill="#FFF"
//                         fillRule="nonzero"
//                       />
//                     </svg>
//                     <div className="text-gray-800 dark:text-gray-100">Vimeo.com</div>
//                   </div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center">1.9K</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center text-green-500">$2,236</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center">220</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center text-sky-500">4.2%</div>
//                 </td>
//               </tr>
//               {/* Row */}
//               <tr>
//                 <td className="p-2">
//                   <div className="flex items-center">
//                     <svg className="shrink-0 mr-2 sm:mr-3" width="36" height="36" viewBox="0 0 36 36">
//                       <circle fill="#0E2439" cx="18" cy="18" r="18" />
//                       <path
//                         d="M14.232 12.818V23H11.77V12.818h2.46zM15.772 23V12.818h2.462v4.087h4.012v-4.087h2.456V23h-2.456v-4.092h-4.012V23h-2.461z"
//                         fill="#E6ECF4"
//                       />
//                     </svg>
//                     <div className="text-gray-800 dark:text-gray-100">Indiehackers.com</div>
//                   </div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center">1.7K</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center text-green-500">$2,034</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center">204</div>
//                 </td>
//                 <td className="p-2">
//                   <div className="text-center text-sky-500">3.9%</div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DashboardCard07;



// ###################### Card08 ############################
// import React from 'react';
// import { chartAreaGradient } from '../../charts/ChartjsConfig';
// import LineChart from '../../charts/LineChart02';

// // Import utilities
// import { getCssVariable } from '../../utils/Utils';

// function DashboardCard08() {

//   const chartData = {
//     labels: [
//       '12-01-2022',
//       '01-01-2023',
//       '02-01-2023',
//       '03-01-2023',
//       '04-01-2023',
//       '05-01-2023',
//       '06-01-2023',
//       '07-01-2023',
//       '08-01-2023',
//       '09-01-2023',
//       '10-01-2023',
//       '11-01-2023',
//       '12-01-2023',
//       '01-01-2024',
//       '02-01-2024',
//       '03-01-2024',
//       '04-01-2024',
//       '05-01-2024',
//       '06-01-2024',
//       '07-01-2024',
//       '08-01-2024',
//       '09-01-2024',
//       '10-01-2024',
//       '11-01-2024',
//       '12-01-2024',
//       '01-01-2025',
//     ],
//     datasets: [
//       // Indigo line
//       {
//         label: 'Current',
//         data: [73, 64, 73, 69, 104, 104, 164, 164, 120, 120, 120, 148, 142, 104, 122, 110, 104, 152, 166, 233, 268, 252, 284, 284, 333, 323],
//         borderColor: getCssVariable('--color-violet-500'),
//         fill: false,
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: getCssVariable('--color-violet-500'),
//         pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,
//         clip: 20,
//         tension: 0.2,
//       },
//       // Blue line
//       {
//         label: 'Previous',
//         data: [184, 86, 42, 378, 42, 243, 38, 120, 0, 0, 42, 0, 84, 0, 276, 0, 124, 42, 124, 88, 88, 215, 156, 88, 124, 64],
//         borderColor: getCssVariable('--color-sky-500'),
//         fill: false,
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: getCssVariable('--color-sky-500'),
//         pointHoverBackgroundColor: getCssVariable('--color-sky-500'),
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,
//         clip: 20,
//         tension: 0.2,
//       },
//       // green line
//       {
//         label: 'Average',
//         data: [122, 170, 192, 86, 102, 124, 115, 115, 56, 104, 0, 72, 208, 186, 223, 188, 114, 162, 200, 150, 118, 118, 76, 122, 230, 268],
//         borderColor: getCssVariable('--color-green-500'),
//         fill: false,
//         borderWidth: 2,
//         pointRadius: 0,
//         pointHoverRadius: 3,
//         pointBackgroundColor: getCssVariable('--color-green-500'),
//         pointHoverBackgroundColor: getCssVariable('--color-green-500'),
//         pointBorderWidth: 0,
//         pointHoverBorderWidth: 0,
//         clip: 20,
//         tension: 0.2,
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100">Sales Over Time (all stores)</h2>
//       </header>
//       {/* Chart built with Chart.js 3 */}
//       {/* Change the height attribute to adjust the chart height */}
//       <LineChart data={chartData} width={595} height={248} />
//     </div>
//   );
// }

// export default DashboardCard08;


// ################## Card09  ###################
// import React from 'react';
// import Tooltip from '../../components/Tooltip';
// import BarChart from '../../charts/BarChart02';

// // Import utilities
// import { getCssVariable } from '../../utils/Utils';

// function DashboardCard09() {

//   const chartData = {
//     labels: [
//       '12-01-2022', '01-01-2023', '02-01-2023',
//       '03-01-2023', '04-01-2023', '05-01-2023',
//     ],
//     datasets: [
//       // Light blue bars
//       {
//         label: 'Stack 1',
//         data: [
//           6200, 9200, 6600, 8800, 5200, 9200,
//         ],
//         backgroundColor: getCssVariable('--color-violet-500'),
//         hoverBackgroundColor: getCssVariable('--color-violet-600'),
//         barPercentage: 0.7,
//         categoryPercentage: 0.7,
//         borderRadius: 4,
//       },
//       // Blue bars
//       {
//         label: 'Stack 2',
//         data: [
//           -4000, -2600, -5350, -4000, -7500, -2000,
//         ],
//         backgroundColor: getCssVariable('--color-violet-200'),
//         hoverBackgroundColor: getCssVariable('--color-violet-300'),
//         barPercentage: 0.7,
//         categoryPercentage: 0.7,
//         borderRadius: 4,
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100">Sales VS Refunds</h2>
//         <Tooltip className="ml-2" size="lg">
//           <div className="text-sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.</div>
//         </Tooltip>
//       </header>
//       <div className="px-5 py-3">
//         <div className="flex items-start">
//           <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">+$6,796</div>
//           <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">-34%</div>
//         </div>
//       </div>
//       {/* Chart built with Chart.js 3 */}
//       <div className="grow">
//         {/* Change the height attribute to adjust the chart height */}
//         <BarChart data={chartData} width={595} height={248} />
//       </div>
//     </div>
//   );
// }

// export default DashboardCard09;


// ################## Card10  ###################
// import React from 'react';

// import Image01 from '../../images/user-36-05.jpg';
// import Image02 from '../../images/user-36-06.jpg';
// import Image03 from '../../images/user-36-07.jpg';
// import Image04 from '../../images/user-36-08.jpg';
// import Image05 from '../../images/user-36-09.jpg';

// function DashboardCard10() {

//   const customers = [
//     {
//       id: '0',
//       image: Image01,
//       name: 'Alex Shatov',
//       email: 'alexshatov@gmail.com',
//       location: '🇺🇸',
//       spent: '$2,890.66',
//     },
//     {
//       id: '1',
//       image: Image02,
//       name: 'Philip Harbach',
//       email: 'philip.h@gmail.com',
//       location: '🇩🇪',
//       spent: '$2,767.04',
//     },
//     {
//       id: '2',
//       image: Image03,
//       name: 'Mirko Fisuk',
//       email: 'mirkofisuk@gmail.com',
//       location: '🇫🇷',
//       spent: '$2,996.00',
//     },
//     {
//       id: '3',
//       image: Image04,
//       name: 'Olga Semklo',
//       email: 'olga.s@cool.design',
//       location: '🇮🇹',
//       spent: '$1,220.66',
//     },
//     {
//       id: '4',
//       image: Image05,
//       name: 'Burak Long',
//       email: 'longburak@gmail.com',
//       location: '🇬🇧',
//       spent: '$1,890.66',
//     },
//   ];

//   return (
//     <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100">Customers</h2>
//       </header>      
//       <div className="p-3">

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="table-auto w-full">
//             {/* Table header */}
//             <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
//               <tr>
//                 <th className="p-2 whitespace-nowrap">
//                   <div className="font-semibold text-left">Name</div>
//                 </th>
//                 <th className="p-2 whitespace-nowrap">
//                   <div className="font-semibold text-left">Email</div>
//                 </th>
//                 <th className="p-2 whitespace-nowrap">
//                   <div className="font-semibold text-left">Spent</div>
//                 </th>
//                 <th className="p-2 whitespace-nowrap">
//                   <div className="font-semibold text-center">Country</div>
//                 </th>
//               </tr>
//             </thead>
//             {/* Table body */}
//             <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
//               {
//                 customers.map(customer => {
//                   return (
//                     <tr key={customer.id}>
//                       <td className="p-2 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
//                             <img className="rounded-full" src={customer.image} width="40" height="40" alt={customer.name} />
//                           </div>
//                           <div className="font-medium text-gray-800 dark:text-gray-100">{customer.name}</div>
//                         </div>
//                       </td>
//                       <td className="p-2 whitespace-nowrap">
//                         <div className="text-left">{customer.email}</div>
//                       </td>
//                       <td className="p-2 whitespace-nowrap">
//                         <div className="text-left font-medium text-green-500">{customer.spent}</div>
//                       </td>
//                       <td className="p-2 whitespace-nowrap">
//                         <div className="text-lg text-center">{customer.location}</div>
//                       </td>
//                     </tr>
//                   )
//                 })
//               }
//             </tbody>
//           </table>

//         </div>

//       </div>
//     </div>
//   );
// }

// export default DashboardCard10;



// ################### Card11 ###################

// import React from 'react';
// import BarChart from '../../charts/BarChart03';

// // Import utilities
// import { getCssVariable } from '../../utils/Utils';

// function DashboardCard11() {

//   const chartData = {
//     labels: ['Reasons'],
//     datasets: [
//       {
//         label: 'Having difficulties using the product',
//         data: [131],
//         backgroundColor: getCssVariable('--color-violet-500'),
//         hoverBackgroundColor: getCssVariable('--color-violet-600'),
//         barPercentage: 1,
//         categoryPercentage: 1,
//       },
//       {
//         label: 'Missing features I need',
//         data: [100],
//         backgroundColor: getCssVariable('--color-violet-700'),
//         hoverBackgroundColor: getCssVariable('--color-violet-800'),
//         barPercentage: 1,
//         categoryPercentage: 1,
//       },
//       {
//         label: 'Not satisfied about the quality of the product',
//         data: [81],
//         backgroundColor: getCssVariable('--color-sky-500'),
//         hoverBackgroundColor: getCssVariable('--color-sky-600'),
//         barPercentage: 1,
//         categoryPercentage: 1,
//       },
//       {
//         label: 'The product doesn’t look as advertised',
//         data: [65],
//         backgroundColor: getCssVariable('--color-green-500'),
//         hoverBackgroundColor: getCssVariable('--color-green-600'),
//         barPercentage: 1,
//         categoryPercentage: 1,
//       },
//       {
//         label: 'Other',
//         data: [72],
//         backgroundColor: getCssVariable('--color-gray-200'),
//         hoverBackgroundColor: getCssVariable('--color-gray-300'),
//         barPercentage: 1,
//         categoryPercentage: 1,
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100">Reason for Refunds</h2>
//       </header>
//       <div className="px-5 py-3">
//         <div className="flex items-start">
//           <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">449</div>
//           <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">-22%</div>
//         </div>
//       </div>      
//       {/* Chart built with Chart.js 3 */}
//       <div className="grow">
//         {/* Change the height attribute to adjust the chart height */}
//         <BarChart data={chartData} width={595} height={48} />
//       </div>
//     </div>
//   );
// }

// export default DashboardCard11;



// ################### Card12 ###################
// import React from 'react';

// function DashboardCard12() {
//   return (
//     <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h2>
//       </header>
//       <div className="p-3">

//         {/* Card content */}
//         {/* "Today" group */}
//         <div>
//           <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">Today</header>
//           <ul className="my-1">
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-violet-500 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
//                   <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center"><a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Nick Mark</a> mentioned <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Sara Smith</a> in a new post</div>
//                   <div className="shrink-0 self-end ml-2">
//                     <a className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">View<span className="hidden sm:inline"> -&gt;</span></a>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-red-500 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
//                   <path d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center">The post <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Post Name</a> was removed by <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Nick Mark</a></div>
//                   <div className="shrink-0 self-end ml-2">
//                     <a className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">View<span className="hidden sm:inline"> -&gt;</span></a>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-green-500 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
//                   <path d="M15 13v-3l-5 4 5 4v-3h8a1 1 0 000-2h-8zM21 21h-8a1 1 0 000 2h8v3l5-4-5-4v3z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center"><a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Patrick Sullivan</a> published a new <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">post</a></div>
//                   <div className="shrink-0 self-end ml-2">
//                     <a className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">View<span className="hidden sm:inline"> -&gt;</span></a>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           </ul>
//         </div>
//         {/* "Yesterday" group */}
//         <div>
//           <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">Yesterday</header>
//           <ul className="my-1">
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-sky-500 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
//                   <path d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center"><a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">240+</a> users have subscribed to <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Newsletter #1</a></div>
//                   <div className="shrink-0 self-end ml-2">
//                     <a className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">View<span className="hidden sm:inline"> -&gt;</span></a>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-violet-500 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
//                   <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center">The post <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Post Name</a> was suspended by <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Nick Mark</a></div>
//                   <div className="shrink-0 self-end ml-2">
//                     <a className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400" href="#0">View<span className="hidden sm:inline"> -&gt;</span></a>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           </ul>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default DashboardCard12;



// ################### Card13 ###################
// import React from 'react';

// function DashboardCard13() {
//   return (
//     <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
//         <h2 className="font-semibold text-gray-800 dark:text-gray-100">Income/Expenses</h2>
//       </header>
//       <div className="p-3">

//         {/* Card content */}
//         {/* "Today" group */}
//         <div>
//           <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">Today</header>
//           <ul className="my-1">
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-red-500 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
//                   <path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center"><a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Qonto</a> billing</div>
//                   <div className="shrink-0 self-start ml-2">
//                     <span className="font-medium text-gray-800 dark:text-gray-100">-$49.88</span>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-green-500 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
//                   <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center"><a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Cruip.com</a> Market Ltd 70 Wilson St London</div>
//                   <div className="shrink-0 self-start ml-2">
//                     <span className="font-medium text-green-600">+249.88</span>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-green-500 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
//                   <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center"><a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Notion Labs Inc</a></div>
//                   <div className="shrink-0 self-start ml-2">
//                     <span className="font-medium text-green-600">+99.99</span>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-green-500 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
//                   <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center"><a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">Market Cap Ltd</a></div>
//                   <div className="shrink-0 self-start ml-2">
//                     <span className="font-medium text-green-600">+1,200.88</span>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-gray-200 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-gray-400" viewBox="0 0 36 36">
//                   <path d="M21.477 22.89l-8.368-8.367a6 6 0 008.367 8.367zm1.414-1.413a6 6 0 00-8.367-8.367l8.367 8.367zM18 26a8 8 0 110-16 8 8 0 010 16z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center"><a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">App.com</a> Market Ltd 70 Wilson St London</div>
//                   <div className="shrink-0 self-start ml-2">
//                     <span className="font-medium text-gray-800 dark:text-gray-100 line-through">+$99.99</span>
//                   </div>
//                 </div>
//               </div>
//             </li>
//             {/* Item */}
//             <li className="flex px-2">
//               <div className="w-9 h-9 rounded-full shrink-0 bg-red-500 my-2 mr-3">
//                 <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
//                   <path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" />
//                 </svg>
//               </div>
//               <div className="grow flex items-center text-sm py-2">
//                 <div className="grow flex justify-between">
//                   <div className="self-center"><a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">App.com</a> Market Ltd 70 Wilson St London</div>
//                   <div className="shrink-0 self-start ml-2">
//                     <span className="font-medium text-gray-800 dark:text-gray-100">-$49.88</span>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           </ul>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default DashboardCard13;





// ********************** BAR CHART 01 **********************

// import React, { useRef, useEffect, useState } from 'react';
// import { useThemeProvider } from '../utils/ThemeContext';

// import { chartColors } from './ChartjsConfig';
// import {
//   Chart, BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend,
// } from 'chart.js';
// import 'chartjs-adapter-moment';

// // Import utilities
// import { formatValue } from '../utils/Utils';

// Chart.register(BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend);

// function BarChart01({
//   data,
//   width,
//   height
// }) {

//   const [chart, setChart] = useState(null)
//   const canvas = useRef(null);
//   const legend = useRef(null);
//   const { currentTheme } = useThemeProvider();
//   const darkMode = currentTheme === 'dark';
//   const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;

//   useEffect(() => {
//     const ctx = canvas.current;
//     // eslint-disable-next-line no-unused-vars
//     const newChart = new Chart(ctx, {
//       type: 'bar',
//       data: data,
//       options: {
//         layout: {
//           padding: {
//             top: 12,
//             bottom: 16,
//             left: 20,
//             right: 20,
//           },
//         },
//         scales: {
//           y: {
//             border: {
//               display: false,
//             },
//             ticks: {
//               maxTicksLimit: 5,
//               callback: (value) => formatValue(value),
//               color: darkMode ? textColor.dark : textColor.light,
//             },
//             grid: {
//               color: darkMode ? gridColor.dark : gridColor.light,
//             },
//           },
//           x: {
//             type: 'time',
//             time: {
//               parser: 'MM-DD-YYYY',
//               unit: 'month',
//               displayFormats: {
//                 month: 'MMM YY',
//               },
//             },
//             border: {
//               display: false,
//             },
//             grid: {
//               display: false,
//             },
//             ticks: {
//               color: darkMode ? textColor.dark : textColor.light,
//             },
//           },
//         },
//         plugins: {
//           legend: {
//             display: false,
//           },
//           tooltip: {
//             callbacks: {
//               title: () => false, // Disable tooltip title
//               label: (context) => formatValue(context.parsed.y),
//             },
//             bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
//             backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
//             borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
//           },
//         },
//         interaction: {
//           intersect: false,
//           mode: 'nearest',
//         },
//         animation: {
//           duration: 500,
//         },
//         maintainAspectRatio: false,
//         resizeDelay: 200,
//       },
//       plugins: [
//         {
//           id: 'htmlLegend',
//           afterUpdate(c, args, options) {
//             const ul = legend.current;
//             if (!ul) return;
//             // Remove old legend items
//             while (ul.firstChild) {
//               ul.firstChild.remove();
//             }
//             // Reuse the built-in legendItems generator
//             const items = c.options.plugins.legend.labels.generateLabels(c);
//             items.forEach((item) => {
//               const li = document.createElement('li');
//               // Button element
//               const button = document.createElement('button');
//               button.style.display = 'inline-flex';
//               button.style.alignItems = 'center';
//               button.style.opacity = item.hidden ? '.3' : '';
//               button.onclick = () => {
//                 c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex));
//                 c.update();
//               };
//               // Color box
//               const box = document.createElement('span');
//               box.style.display = 'block';
//               box.style.width = '12px';
//               box.style.height = '12px';
//               box.style.borderRadius = 'calc(infinity * 1px)';
//               box.style.marginRight = '8px';
//               box.style.borderWidth = '3px';
//               box.style.borderColor = item.fillStyle;
//               box.style.pointerEvents = 'none';
//               // Label
//               const labelContainer = document.createElement('span');
//               labelContainer.style.display = 'flex';
//               labelContainer.style.alignItems = 'center';
//               const value = document.createElement('span');
//               value.classList.add('text-gray-800', 'dark:text-gray-100');
//               value.style.fontSize = '30px';
//               value.style.lineHeight = 'calc(2.25 / 1.875)';
//               value.style.fontWeight = '700';
//               value.style.marginRight = '8px';
//               value.style.pointerEvents = 'none';
//               const label = document.createElement('span');
//               label.classList.add('text-gray-500', 'dark:text-gray-400');
//               label.style.fontSize = '14px';
//               label.style.lineHeight = 'calc(1.25 / 0.875)';
//               const theValue = c.data.datasets[item.datasetIndex].data.reduce((a, b) => a + b, 0);
//               const valueText = document.createTextNode(formatValue(theValue));
//               const labelText = document.createTextNode(item.text);
//               value.appendChild(valueText);
//               label.appendChild(labelText);
//               li.appendChild(button);
//               button.appendChild(box);
//               button.appendChild(labelContainer);
//               labelContainer.appendChild(value);
//               labelContainer.appendChild(label);
//               ul.appendChild(li);
//             });
//           },
//         },
//       ],
//     });
//     setChart(newChart);
//     return () => newChart.destroy();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!chart) return;

//     if (darkMode) {
//       chart.options.scales.x.ticks.color = textColor.dark;
//       chart.options.scales.y.ticks.color = textColor.dark;
//       chart.options.scales.y.grid.color = gridColor.dark;
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
//     } else {
//       chart.options.scales.x.ticks.color = textColor.light;
//       chart.options.scales.y.ticks.color = textColor.light;
//       chart.options.scales.y.grid.color = gridColor.light;
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
//     }
//     chart.update('none');
//   }, [currentTheme]);

//   return (
//     <React.Fragment>
//       <div className="px-5 py-3">
//         <ul ref={legend} className="flex flex-wrap gap-x-4"></ul>
//       </div>
//       <div className="grow">
//         <canvas ref={canvas} width={width} height={height}></canvas>
//       </div>
//     </React.Fragment>
//   );
// }

// export default BarChart01;


// ************** BAR CHART 02 **************
// import React, { useRef, useEffect, useState } from 'react';
// import { useThemeProvider } from '../utils/ThemeContext';

// import { chartColors } from './ChartjsConfig';
// import {
//   Chart, BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend,
// } from 'chart.js';
// import 'chartjs-adapter-moment';

// // Import utilities
// import { formatValue } from '../utils/Utils';

// Chart.register(BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend);

// function BarChart02({
//   data,
//   width,
//   height
// }) {

//   const [chart, setChart] = useState(null)
//   const canvas = useRef(null);
//   const { currentTheme } = useThemeProvider();
//   const darkMode = currentTheme === 'dark';
//   const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors; 

//   useEffect(() => {
//     const ctx = canvas.current;
//     // eslint-disable-next-line no-unused-vars
//     const newChart = new Chart(ctx, {
//       type: 'bar',
//       data: data,
//       options: {
//         layout: {
//           padding: {
//             top: 12,
//             bottom: 16,
//             left: 20,
//             right: 20,
//           },
//         },
//         scales: {
//           y: {
//             stacked: true,
//             border: {
//               display: false,
//             },
//             beginAtZero: true,
//             ticks: {
//               maxTicksLimit: 5,
//               callback: (value) => formatValue(value),
//               color: darkMode ? textColor.dark : textColor.light,
//             },
//             grid: {
//               color: darkMode ? gridColor.dark : gridColor.light,
//             },
//           },
//           x: {
//             stacked: true,
//             type: 'time',
//             time: {
//               parser: 'MM-DD-YYYY',
//               unit: 'month',
//               displayFormats: {
//                 month: 'MMM YY',
//               },
//             },
//             border: {
//               display: false,
//             },
//             grid: {
//               display: false,
//             },
//             ticks: {
//               autoSkipPadding: 48,
//               maxRotation: 0,
//               color: darkMode ? textColor.dark : textColor.light,
//             },
//           },
//         },
//         plugins: {
//           legend: {
//             display: false,
//           },
//           tooltip: {
//             callbacks: {
//               title: () => false, // Disable tooltip title
//               label: (context) => formatValue(context.parsed.y),
//             },
//             bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
//             backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
//             borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
//           },
//         },
//         interaction: {
//           intersect: false,
//           mode: 'nearest',
//         },
//         animation: {
//           duration: 200,
//         },
//         maintainAspectRatio: false,
//         resizeDelay: 200,
//       },
//     });
//     setChart(newChart);
//     return () => newChart.destroy();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!chart) return;

//     if (darkMode) {
//       chart.options.scales.x.ticks.color = textColor.dark;
//       chart.options.scales.y.ticks.color = textColor.dark;
//       chart.options.scales.y.grid.color = gridColor.dark;
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
//     } else {
//       chart.options.scales.x.ticks.color = textColor.light;
//       chart.options.scales.y.ticks.color = textColor.light;
//       chart.options.scales.y.grid.color = gridColor.light;
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
//     }
//     chart.update('none');
//   }, [currentTheme]);

//   return (
//     <canvas ref={canvas} width={width} height={height}></canvas>
//   );
// }

// export default BarChart02;



// *************** BAR CHART 03 ***************

// import React, { useRef, useEffect, useState } from 'react';
// import { useThemeProvider } from '../utils/ThemeContext';

// import { chartColors } from './ChartjsConfig';
// import {
//   Chart, BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend,
// } from 'chart.js';
// import 'chartjs-adapter-moment';

// // Import utilities
// import { formatThousands } from '../utils/Utils';

// Chart.register(BarController, BarElement, LinearScale, TimeScale, Tooltip, Legend);

// function BarChart03({
//   data,
//   width,
//   height
// }) {

//   const [chart, setChart] = useState(null)
//   const canvas = useRef(null);
//   const legend = useRef(null);
//   const { currentTheme } = useThemeProvider();
//   const darkMode = currentTheme === 'dark';
//   const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors; 

//   useEffect(() => {
//     const ctx = canvas.current;
//     // eslint-disable-next-line no-unused-vars
//     const newChart = new Chart(ctx, {
//       type: 'bar',
//       data: data,
//       options: {
//         layout: {
//           padding: {
//             top: 12,
//             bottom: 16,
//             left: 20,
//             right: 20,
//           },
//         },
//         scales: {
//           y: {
//             stacked: true,
//             border: {
//               display: false,
//             },
//             beginAtZero: true,
//             ticks: {
//               maxTicksLimit: 5,
//               callback: (value) => formatThousands(value),
//               color: darkMode ? textColor.dark : textColor.light,
//             },
//             grid: {
//               color: darkMode ? gridColor.dark : gridColor.light,
//             },
//           },
//           x: {
//             stacked: true,
//             type: 'time',
//             time: {
//               parser: 'MM-DD-YYYY',
//               unit: 'month',
//               displayFormats: {
//                 month: 'MMM',
//               },
//             },
//             border: {
//               display: false,
//             },
//             grid: {
//               display: false,
//             },
//             ticks: {
//               autoSkipPadding: 48,
//               maxRotation: 0,
//               color: darkMode ? textColor.dark : textColor.light,
//             },
//           },
//         },
//         plugins: {
//           legend: {
//             display: false,
//           },
//           tooltip: {
//             callbacks: {
//               title: () => false, // Disable tooltip title
//               label: (context) => formatThousands(context.parsed.y),
//             },
//             bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
//             backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
//             borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
//           },
//         },
//         interaction: {
//           intersect: false,
//           mode: 'nearest',
//         },
//         animation: {
//           duration: 500,
//         },
//         maintainAspectRatio: false,
//         resizeDelay: 200,
//       },
//       plugins: [{
//         id: 'htmlLegend',
//         afterUpdate(c, args, options) {
//           const ul = legend.current
//           if (!ul) return
//           // Remove old legend items
//           while (ul.firstChild) {
//             ul.firstChild.remove()
//           }
//           // Reuse the built-in legendItems generator
//           const items = c.options.plugins.legend.labels.generateLabels(c)
//           items.forEach((item) => {
//             const li = document.createElement('li')
//             // Button element
//             const button = document.createElement('button')
//             button.style.display = 'inline-flex';
//             button.style.alignItems = 'center';
//             button.style.opacity = item.hidden ? '.3' : '';
//             button.onclick = () => {
//               c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex))
//               c.update()
//             };
//             // Color box
//             const box = document.createElement('span')
//             box.style.display = 'block';
//             box.style.width = '12px';
//             box.style.height = '12px';
//             box.style.borderRadius = 'calc(infinity * 1px)';
//             box.style.marginRight = '8px';
//             box.style.borderWidth = '3px';
//             box.style.borderColor = item.fillStyle;
//             box.style.pointerEvents = 'none';
//             // Label
//             const label = document.createElement('span')
//             label.classList.add('text-gray-500', 'dark:text-gray-400');
//             label.style.fontSize = '14px';
//             label.style.lineHeight = 'calc(1.25 / 0.875)';
//             const labelText = document.createTextNode(item.text)
//             label.appendChild(labelText)
//             li.appendChild(button)
//             button.appendChild(box)
//             button.appendChild(label)
//             ul.appendChild(li)
//           })
//         },
//       }],
//     });
//     setChart(newChart);
//     return () => newChart.destroy();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!chart) return;

//     if (darkMode) {
//       chart.options.scales.x.ticks.color = textColor.dark;
//       chart.options.scales.y.ticks.color = textColor.dark;
//       chart.options.scales.y.grid.color = gridColor.dark;
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
//     } else {
//       chart.options.scales.x.ticks.color = textColor.light;
//       chart.options.scales.y.ticks.color = textColor.light;
//       chart.options.scales.y.grid.color = gridColor.light;
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
//     }
//     chart.update('none');
//   }, [currentTheme]);

//   return (
//     <React.Fragment>
//       <div className="px-5 py-4">
//         <div className="grow mb-1">
//           <ul ref={legend} className="flex flex-wrap gap-x-4"></ul>
//         </div>
//       </div>
//       <div className="grow">
//         <canvas ref={canvas} width={width} height={height}></canvas>
//       </div>      
//     </React.Fragment>
//   );
// }

// export default BarChart03;




// ***************** Doughnutt Chart*****************
// import React, { useRef, useEffect, useState } from 'react';
// import { useThemeProvider } from '../utils/ThemeContext';

// import { chartColors } from './ChartjsConfig';
// import {
//   Chart, DoughnutController, ArcElement, TimeScale, Tooltip,
// } from 'chart.js';
// import 'chartjs-adapter-moment';

// Chart.register(DoughnutController, ArcElement, TimeScale, Tooltip);

// function DoughnutChart({
//   data,
//   width,
//   height
// }) {

//   const [chart, setChart] = useState(null)
//   const canvas = useRef(null);
//   const legend = useRef(null);
//   const { currentTheme } = useThemeProvider();
//   const darkMode = currentTheme === 'dark';
//   const { tooltipTitleColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors; 

//   useEffect(() => {
//     const ctx = canvas.current;
//     // eslint-disable-next-line no-unused-vars
//     const newChart = new Chart(ctx, {
//       type: 'doughnut',
//       data: data,
//       options: {
//         cutout: '80%',
//         layout: {
//           padding: 24,
//         },
//         plugins: {
//           legend: {
//             display: false,
//           },
//           tooltip: {
//             titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
//             bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
//             backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
//             borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
//           },
//         },
//         interaction: {
//           intersect: false,
//           mode: 'nearest',
//         },
//         animation: {
//           duration: 500,
//         },
//         maintainAspectRatio: false,
//         resizeDelay: 200,
//       },
//       plugins: [
//         {
//           id: 'htmlLegend',
//           afterUpdate(c, args, options) {
//             const ul = legend.current;
//             if (!ul) return;
//             // Remove old legend items
//             while (ul.firstChild) {
//               ul.firstChild.remove();
//             }
//             // Reuse the built-in legendItems generator
//             const items = c.options.plugins.legend.labels.generateLabels(c);
//             items.forEach((item) => {
//               const li = document.createElement('li');
//               li.style.margin = '4px';
//               // Button element
//               const button = document.createElement('button');
//               button.classList.add('btn-xs', 'bg-white', 'dark:bg-gray-700', 'text-gray-500', 'dark:text-gray-400', 'shadow-xs', 'shadow-black/[0.08]', 'rounded-full');
//               button.style.opacity = item.hidden ? '.3' : '';
//               button.onclick = () => {
//                 c.toggleDataVisibility(item.index);
//                 c.update();
//               };
//               // Color box
//               const box = document.createElement('span');
//               box.style.display = 'block';
//               box.style.width = '8px';
//               box.style.height = '8px';
//               box.style.backgroundColor = item.fillStyle;
//               box.style.borderRadius = '4px';
//               box.style.marginRight = '4px';
//               box.style.pointerEvents = 'none';
//               // Label
//               const label = document.createElement('span');
//               label.style.display = 'flex';
//               label.style.alignItems = 'center';
//               const labelText = document.createTextNode(item.text);
//               label.appendChild(labelText);
//               li.appendChild(button);
//               button.appendChild(box);
//               button.appendChild(label);
//               ul.appendChild(li);
//             });
//           },
//         },
//       ],
//     });
//     setChart(newChart);
//     return () => newChart.destroy();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!chart) return;

//     if (darkMode) {
//       chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
//     } else {
//       chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
//     }
//     chart.update('none');
//   }, [currentTheme]);

//   return (
//     <div className="grow flex flex-col justify-center">
//       <div>
//         <canvas ref={canvas} width={width} height={height}></canvas>
//       </div>
//       <div className="px-5 pt-2 pb-6">
//         <ul ref={legend} className="flex flex-wrap justify-center -m-1"></ul>
//       </div>
//     </div>
//   );
// }

// export default DoughnutChart;



// ********* LineChart01 ###############
// import React, { useRef, useEffect, useState } from 'react';
// import { useThemeProvider } from '../utils/ThemeContext';

// import { chartColors } from './ChartjsConfig';
// import {
//   Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
// } from 'chart.js';
// import 'chartjs-adapter-moment';

// // Import utilities
// import { formatValue } from '../utils/Utils';

// Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

// function LineChart01({
//   data,
//   width,
//   height
// }) {

//   const [chart, setChart] = useState(null)
//   const canvas = useRef(null);
//   const { currentTheme } = useThemeProvider();
//   const darkMode = currentTheme === 'dark';
//   const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors; 

//   useEffect(() => {
//     const ctx = canvas.current;
//     // eslint-disable-next-line no-unused-vars
//     const newChart = new Chart(ctx, {
//       type: 'line',
//       data: data,
//       options: {
//         layout: {
//           padding: 20,
//         },
//         scales: {
//           y: {
//             display: false,
//             beginAtZero: true,
//           },
//           x: {
//             type: 'time',
//             time: {
//               parser: 'MM-DD-YYYY',
//               unit: 'month',
//             },
//             display: false,
//           },
//         },
//         plugins: {
//           tooltip: {
//             callbacks: {
//               title: () => false, // Disable tooltip title
//               label: (context) => formatValue(context.parsed.y),
//             },
//             bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
//             backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
//             borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
//           },
//           legend: {
//             display: false,
//           },
//         },
//         interaction: {
//           intersect: false,
//           mode: 'nearest',
//         },
//         maintainAspectRatio: false,
//         resizeDelay: 200,
//       },
//     });
//     setChart(newChart);
//     return () => newChart.destroy();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!chart) return;

//     if (darkMode) {
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
//     } else {
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
//     }
//     chart.update('none');
//   }, [currentTheme]);

//   return (
//     <canvas ref={canvas} width={width} height={height}></canvas>
//   );
// }

// export default LineChart01;



// ************* LineChart02 *************

// import React, { useRef, useEffect, useState } from 'react';
// import { useThemeProvider } from '../utils/ThemeContext';

// import { chartColors } from './ChartjsConfig';
// import {
//   Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
// } from 'chart.js';
// import 'chartjs-adapter-moment';

// // Import utilities
// import { formatValue } from '../utils/Utils';

// Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

// function LineChart02({
//   data,
//   width,
//   height
// }) {

//   const [chart, setChart] = useState(null)
//   const canvas = useRef(null);
//   const legend = useRef(null);
//   const { currentTheme } = useThemeProvider();
//   const darkMode = currentTheme === 'dark';
//   const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors;  

//   useEffect(() => {
//     const ctx = canvas.current;
//     // eslint-disable-next-line no-unused-vars
//     const newChart = new Chart(ctx, {
//       type: 'line',
//       data: data,
//       options: {
//         layout: {
//           padding: 20,
//         },
//         scales: {
//           y: {
//             border: {
//               display: false,
//             },
//             beginAtZero: true,
//             ticks: {
//               maxTicksLimit: 5,
//               callback: (value) => formatValue(value),
//               color: darkMode ? textColor.dark : textColor.light,
//             },
//             grid: {
//               color: darkMode ? gridColor.dark : gridColor.light,
//             },
//           },
//           x: {
//             type: 'time',
//             time: {
//               parser: 'MM-DD-YYYY',
//               unit: 'month',
//               displayFormats: {
//                 month: 'MMM YY',
//               },
//             },
//             border: {
//               display: false,
//             },
//             grid: {
//               display: false,
//             },
//             ticks: {
//               autoSkipPadding: 48,
//               maxRotation: 0,
//               color: darkMode ? textColor.dark : textColor.light,
//             },
//           },
//         },
//         plugins: {
//           legend: {
//             display: false,
//           },
//           tooltip: {
//             callbacks: {
//               title: () => false, // Disable tooltip title
//               label: (context) => formatValue(context.parsed.y),
//             },
//             bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
//             backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
//             borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
//           },
//         },
//         interaction: {
//           intersect: false,
//           mode: 'nearest',
//         },
//         maintainAspectRatio: false,
//         resizeDelay: 200,
//       },
//       plugins: [
//         {
//           id: 'htmlLegend',
//           afterUpdate(c, args, options) {
//             const ul = legend.current;
//             if (!ul) return;
//             // Remove old legend items
//             while (ul.firstChild) {
//               ul.firstChild.remove();
//             }
//             // Reuse the built-in legendItems generator
//             const items = c.options.plugins.legend.labels.generateLabels(c);
//             items.slice(0, 2).forEach((item) => {
//               const li = document.createElement('li');
//               // Button element
//               const button = document.createElement('button');
//               button.style.display = 'inline-flex';
//               button.style.alignItems = 'center';
//               button.style.opacity = item.hidden ? '.3' : '';
//               button.onclick = () => {
//                 c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex));
//                 c.update();
//               };
//               // Color box
//               const box = document.createElement('span');
//               box.style.display = 'block';
//               box.style.width = '12px';
//               box.style.height = '12px';
//               box.style.borderRadius = 'calc(infinity * 1px)';
//               box.style.marginRight = '8px';
//               box.style.borderWidth = '3px';
//               box.style.borderColor = c.data.datasets[item.datasetIndex].borderColor;
//               box.style.pointerEvents = 'none';
//               // Label
//               const label = document.createElement('span');
//               label.classList.add('text-gray-500', 'dark:text-gray-400');
//               label.style.fontSize = '14px';
//               label.style.lineHeight = 'calc(1.25 / 0.875)';
//               const labelText = document.createTextNode(item.text);
//               label.appendChild(labelText);
//               li.appendChild(button);
//               button.appendChild(box);
//               button.appendChild(label);
//               ul.appendChild(li);
//             });
//           },
//         },
//       ],
//     });
//     setChart(newChart);
//     return () => newChart.destroy();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!chart) return;

//     if (darkMode) {
//       chart.options.scales.x.ticks.color = textColor.dark;
//       chart.options.scales.y.ticks.color = textColor.dark;
//       chart.options.scales.y.grid.color = gridColor.dark;
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
//     } else {
//       chart.options.scales.x.ticks.color = textColor.light;
//       chart.options.scales.y.ticks.color = textColor.light;
//       chart.options.scales.y.grid.color = gridColor.light;
//       chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
//       chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
//       chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
//     }
//     chart.update('none');
//   }, [currentTheme]);

//   return (
//     <React.Fragment>
//       <div className="px-5 py-3">
//         <div className="flex flex-wrap justify-between items-end gap-y-2 gap-x-4">
//           <div className="flex items-start">
//             <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">$1,482</div>
//             <div className="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full">-22%</div>
//           </div>
//           <div className="grow mb-1">
//             <ul ref={legend} className="flex flex-wrap gap-x-4 sm:justify-end"></ul>
//           </div>
//         </div>
//       </div>
//       {/* Chart built with Chart.js 3 */}
//       <div className="grow">
//         <canvas ref={canvas} width={width} height={height}></canvas>
//       </div>
//     </React.Fragment>
//   );
// }

// export default LineChart02;



// **************** RealtimeChart.jsx ###############
