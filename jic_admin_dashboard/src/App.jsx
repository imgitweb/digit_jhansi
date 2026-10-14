import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './css/style.css';
import './charts/ChartjsConfig';

// Context & Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';

// Import pages
import Dashboard from './pages/Dashboard';
import ResourcePool from './pages/ResourcePool';
import Riders from './pages/Riders';
import Enablers from './pages/Enablers';
import IndustriesUnder50L from './pages/IndustriesUnder50L';
import Industries50LPlus from './pages/Industries50LPlus';
import Institutions from './pages/Institutions';

import DistrictDashboard from './pages/DistrictDashboard';
import NotFound from './pages/NotFound';

import Cohorts from './pages/Cohorts';
import CohortDetail from './pages/CohortDetail';

import SummaryKPIsPage from './pages/dashboard_management/SummaryKPIsPage';
import IndustryDistributionPage from './pages/dashboard_management/IndustryDistributionPage';
import BusinessGrowthPage from './pages/dashboard_management/BusinessGrowthPage';
import WorkforceAnalyticsPage from './pages/dashboard_management/WorkforceAnalyticsPage';
import SkillGapAnalysisPage from './pages/dashboard_management/SkillGapAnalysisPage';
import DigitalAdoptionPage from './pages/dashboard_management/DigitalAdoptionPage';
import ExportAnalyticsPage from './pages/dashboard_management/ExportAnalyticsPage';
import IndustryHealthPage from './pages/dashboard_management/IndustryHealthPage';
import EconomicMapPage from './pages/dashboard_management/EconomicMapPage';
import InfrastructureStatsPage from './pages/dashboard_management/InfrastructureStatsPage';
import OfferingsPage from './pages/OfferingsPage';
import ChatBotWidget from './pages/ChatBotWidget';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Try named class first, fall back to any overflow-y-auto sibling of sidebar
    const mainContent =
      document.querySelector('.main-content-scroll') ||
      document.querySelector('.flex.h-screen > div[class*="overflow-y-auto"]');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [location.pathname])

  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 72,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            maxWidth: '380px',
            padding: '12px 16px',
          },
          success: {
            duration: 3000,
            iconTheme: { primary: '#3ec972', secondary: '#ffffff' },
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #8bf0b0',
            },
          },
          error: {
            duration: 5000,
            iconTheme: { primary: '#ff5656', secondary: '#ffffff' },
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #ffb2b2',
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
            },
          },
        }}
      />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* <Route exact path="/" element={<Dashboard />} /> */}
          <Route exact path="/" element={<DistrictDashboard />} />

          <Route path="/resources" element={<ResourcePool />} />
          <Route path="/resources/:id" element={<ResourcePool />} />

          <Route path="/riders" element={<Riders />} />
          <Route path="/riders/:id" element={<Riders />} />

          <Route path="/enablers" element={<Enablers />} />
          <Route path="/enablers/:id" element={<Enablers />} />

          <Route path="/industries-under50l" element={<IndustriesUnder50L />} />
          <Route path="/industries-under50l/:id" element={<IndustriesUnder50L />} />

          <Route path="/industries-50lplus" element={<Industries50LPlus />} />
          <Route path="/industries-50lplus/:id" element={<Industries50LPlus />} />

          <Route path="/institutions" element={<Institutions />} />
          <Route path="/institutions/:id" element={<Institutions /> } />

          <Route path="/cohorts" element={<Cohorts />} />
          <Route path="/cohorts/:id" element={<CohortDetail />} />

          <Route path="/offerings" element={<OfferingsPage />} />


          {/* Dashboard Management */}
          <Route path="/summary-kpis" element={<SummaryKPIsPage />} />
          <Route path="/industry-distribution" element={<IndustryDistributionPage />} />
          <Route path="/business-growth" element={<BusinessGrowthPage />} />
          <Route path="/workforce-analytics" element={<WorkforceAnalyticsPage />} />
          <Route path="/skill-gap-analysis" element={<SkillGapAnalysisPage />} />
          <Route path="/digital-adoption" element={<DigitalAdoptionPage />} />
          <Route path="/export-analytics" element={<ExportAnalyticsPage />} />
          <Route path="/industry-health" element={<IndustryHealthPage />} />
          <Route path="/economic-map" element={<EconomicMapPage />} />
          <Route path="/infrastructure-stats" element={<InfrastructureStatsPage />} />

          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
      <ChatBotWidget />
    </AuthProvider>
  );
}

export default App;