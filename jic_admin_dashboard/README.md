Satna PRD Admin Dashboard — Frontend README📋 Table of Contents

Project Overview
Tech Stack
Project Structure
Getting Started
Environment Variables
Theme & Design System
Pages & Routes
Modules
Features
Components
Hooks
API Layer

🏛️ Project Overview 
1. <a name="overview"></a>Satna PRD Admin Dashboard is a high-performance, 
2. production-grade admin panel built for the Industry & Commerce Intelligence Platform of Satna, Madhya Pradesh.It enables government administrators to manage, monitor, and analyze data across five core modules — Resource Hub, Riders Database, Ecommerce Enablers, Industry Pool (Under ₹50L), and Industry Pool (₹50L+) — with real-time statistics, Excel bulk imports, individual record management, and a comprehensive district overview dashboard.
3. ⚡ Tech Stack <a name="tech-stack"></a>CategoryTechnologyFrameworkReact 19Build ToolVite 6RoutingReact Router DOM v7StylingTailwind CSS v4 + Inline StylesChartsChart.js v4 + RechartsHTTP ClientAxiosIconsLucide ReactNotificationsReact Hot ToastDate PickerReact Day Picker v9UI PopoverRadix UI PopoverAnimationsFramer MotionFontsInter, Sora, Oswald (Google Fonts)Package Managernpm / pnpm

📁 Project Structure <a name="structure"></a>
sic_admin_dashboard/
├── public/
│   └── templates/                    # Excel sample templates
│       ├── Resource_Hub_Template.xlsx
│       ├── Riders_Database_Template.xlsx
│       ├── Ecommerce_Enablers_Template.xlsx
│       ├── Industry_Pool_Under50L_Template.xlsx
│       └── Industry_Pool_50L_Plus_Template.xlsx
│
├── src/
│   ├── api/                          # Axios API layer
│   │   ├── axiosInstance.js          # Base axios config + interceptors
│   │   ├── authApi.js                # Auth endpoints
│   │   ├── resourceApi.js            # Resource Hub API
│   │   ├── riderApi.js               # Riders Database API
│   │   ├── enablerApi.js             # Ecommerce Enablers API
│   │   ├── industryUnder50LApi.js    # Industry Pool (<50L) API
│   │   └── industry50LPlusApi.js     # Industry Pool (50L+) API
│   │
│   ├── charts/                       # Chart.js components
│   │   ├── ChartjsConfig.jsx         # Global chart configuration
│   │   ├── LineChart01.jsx           # Minimal line chart (stat cards)
│   │   ├── LineChart02.jsx           # Full line chart with legend
│   │   ├── BarChart01.jsx            # Grouped bar chart
│   │   ├── BarChart02.jsx            # Stacked bar chart
│   │   ├── BarChart03.jsx            # Horizontal bar chart
│   │   ├── DoughnutChart.jsx         # Doughnut/donut chart
│   │   └── RealtimeChart.jsx         # Realtime chart (reserved)
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx    # Auth guard wrapper
│   │   │
│   │   ├── ResourcePool/             # Resource Hub components
│   │   │   ├── ResourceTable.jsx
│   │   │   ├── ResourceFilters.jsx
│   │   │   ├── ResourceFormModal.jsx
│   │   │   ├── ResourceProfile.jsx
│   │   │   ├── ResourceDetailModal.jsx
│   │   │   └── ExcelUploader.jsx
│   │   │
│   │   ├── Riders/                   # Riders Database components
│   │   │   ├── RiderTable.jsx
│   │   │   ├── RiderFilters.jsx
│   │   │   ├── RiderFormModal.jsx
│   │   │   ├── RiderProfile.jsx
│   │   │   └── RiderExcelUploader.jsx
│   │   │
│   │   ├── Enablers/                 # Ecommerce Enablers components
│   │   │   ├── EnablerTable.jsx
│   │   │   ├── EnablerFilters.jsx
│   │   │   ├── EnablerFormModal.jsx
│   │   │   ├── EnablerProfile.jsx
│   │   │   └── EnablerExcelUploader.jsx
│   │   │
│   │   ├── IndustryUnder50L/         # Industry Pool (<50L) components
│   │   │   ├── IndustryTable.jsx
│   │   │   ├── IndustryFilters.jsx
│   │   │   ├── IndustryFormModal.jsx
│   │   │   ├── IndustryProfile.jsx
│   │   │   └── IndustryExcelUploader.jsx
│   │   │
│   │   ├── Industry50LPlus/          # Industry Pool (50L+) components
│   │   │   ├── Industry50LTable.jsx
│   │   │   ├── Industry50LFilters.jsx
│   │   │   ├── Industry50LFormModal.jsx
│   │   │   ├── Industry50LProfile.jsx
│   │   │   └── Industry50LExcelUploader.jsx
│   │   │
│   │   └── ui/                       # Shared UI primitives
│   │       ├── calendar.jsx
│   │       ├── popover.jsx
│   │       ├── DateSelect.jsx
│   │       ├── Datepicker.jsx
│   │       ├── DropdownEditMenu.jsx
│   │       ├── DropdownFilter.jsx
│   │       ├── DropdownHelp.jsx
│   │       ├── DropdownNotifications.jsx
│   │       ├── DropdownProfile.jsx
│   │       ├── ModalSearch.jsx
│   │       ├── ThemeToggle.jsx       # (removed in v2)
│   │       └── Tooltip.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx           # Global auth state
│   │
│   ├── css/
│   │   ├── style.css                 # Main CSS + Tailwind v4
│   │   └── additional-styles/
│   │       └── utility-patterns.css  # .btn, .form-input etc.
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useDashboardStats.js
│   │   ├── useResources.js
│   │   ├── useRiders.js
│   │   ├── useEnablers.js
│   │   ├── useIndustriesUnder50L.js
│   │   └── useIndustries50LPlus.js
│   │
│   ├── lib/
│   │   └── utils.ts                  # cn() utility + formatDate
│   │
│   ├── pages/                        # Page-level components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx             # Main dashboard (Overview)
│   │   ├── DistrictDashboard.jsx     # District overview page
│   │   ├── ResourcePool.jsx
│   │   ├── Riders.jsx
│   │   ├── Enablers.jsx
│   │   ├── IndustriesUnder50L.jsx
│   │   ├── Industries50LPlus.jsx
│   │   └── NotFound.jsx              # 404 + Coming Soon
│   │
│   ├── partials/
│   │   ├── Header.jsx                # Top navigation bar
│   │   ├── Sidebar.jsx               # Left navigation sidebar
│   │   ├── SidebarLinkGroup.jsx      # Sidebar group helper
│   │   └── dashboard/                # Dashboard card components
│   │       ├── DashboardCard01.jsx   # Resource Hub stat card
│   │       ├── DashboardCard02.jsx   # Riders stat card
│   │       ├── DashboardCard03.jsx   # Enablers stat card
│   │       ├── DashboardCard04.jsx   # Industry (<50L) bar chart
│   │       ├── DashboardCard05.jsx   # Industry (50L+) line chart
│   │       ├── DashboardCard06.jsx   # Module distribution donut
│   │       ├── DashboardCard07.jsx   # Module overview table
│   │       ├── DashboardCard08.jsx   # Registrations trend line
│   │       ├── DashboardCard09.jsx   # Upload vs manual bar
│   │       ├── DashboardCard10.jsx   # Recent registrations table
│   │       ├── DashboardCard11.jsx   # Status distribution bar
│   │       ├── DashboardCard12.jsx   # Recent activity feed
│   │       └── DashboardCard13.jsx   # Data ingestion summary
│   │
│   ├── utils/
│   │   ├── ThemeContext.jsx          # Light/dark theme provider
│   │   ├── templateDownloader.js     # Excel template download util
│   │   ├── Transition.jsx            # CSS transition wrapper
│   │   └── Utils.js                  # formatCount, getCssVariable etc.
│   │
│   ├── App.jsx                       # Root app + routing
│   └── main.jsx                      # React DOM entry point
│
├── .env                              # Environment variables
├── .gitignore
├── index.html
├── package.json
├── postcss.config.cjs
├── vite.config.js
└── README.md


Prerequisites :-
Node.js >= 18.x
npm >= 9.x

# Clone the repository
git clone <repository-url>
cd sic_admin_dashboard

# Install dependencies
npm install

# Start development server
npm run dev


npm run build
npm run preview


Theme & Design System <a name="theme"></a>
Primary Green:     #03D985
Primary Hover:     #02b870
Page Background:   #f5f5f5
Card Background:   #ffffff
Card Border:       #e8e8e8
Text Primary:      #111111
Text Secondary:    #555555
Text Muted:        #888888
Sidebar BG:        #0a0a0a   (dark)