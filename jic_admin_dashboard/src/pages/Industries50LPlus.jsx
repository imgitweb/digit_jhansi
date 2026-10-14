import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import useIndustries50LPlus from '../hooks/useIndustries50LPlus';
import Industry50LTable from '../components/Industry50LPlus/Industry50LTable';
import Industry50LFilters from '../components/Industry50LPlus/Industry50LFilters';
import Industry50LFormModal from '../components/Industry50LPlus/Industry50LFormModal';
import Industry50LProfile from '../components/Industry50LPlus/Industry50LProfile';
import Industry50LExcelUploader from '../components/Industry50LPlus/Industry50LExcelUploader';
import { downloadIndustry50LPlusTemplate } from '../utils/templateDownloader';

function Industries50LPlus() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, pagination, loading, error, filters, updateFilter, fetchIndustries50L, resetFilters } = useIndustries50LPlus();

  const { id } = useParams();
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const [profileRefreshTick, setProfileRefreshTick] = useState(0);

  const handleEdit = (industry) => {
    setSelectedIndustry(industry);
    setIsFormOpen(true);
  };

  const handleView = (industry) => {
    navigate(`/industries-50lplus/${industry._id}`);
  };

  const handleAddNew = () => {
    setSelectedIndustry(null);
    setIsFormOpen(true);
  };

  const handleFormCloseAndRefresh = () => {
    setIsFormOpen(false);
    fetchIndustries50L();
    setProfileRefreshTick(prev => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out main-content-scroll"
        style={{ background: '#f5f5f5' }}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: id ? '16px 24px 0 24px' : '24px 24px 32px 24px',
            width: '100%',
            flex: id ? 1 : 'none',
            display: id ? 'flex' : 'block',
            flexDirection: id ? 'column' : undefined,
            maxWidth: 1400,
            margin: '0 auto',
          }}>

            {/* Header Area */}
            <div
              className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4"
              style={{ marginBottom: id ? 12 : 24 }}
            >
              <div className="mb-4 sm:mb-0">
                <h1 className="text-[22px] sm:text-[24px] font-bold text-[#111111] break-words">
                  {id ? 'Industry Details' : 'Industry Pool (50L+)'}
                </h1>
              </div>

              {!id && (
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full xl:w-auto">
                  <button
                    type="button"
                    onClick={downloadIndustry50LPlusTemplate}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #dddddd',
                      color: '#555555',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 hover:bg-[#f5f5f5] transition-colors"
                  >
                    <svg
                      className="shrink-0 w-4 h-4 mr-2"
                      style={{ fill: '#888888' }}
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 12a.75.75 0 0 1-.53-.22l-4-4a.75.75 0 1 1 1.06-1.06L8 10.19l3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4A.75.75 0 0 1 8 12Z" />
                      <path d="M8 12a.75.75 0 0 1-.75-.75v-8.5a.75.75 0 0 1 1.5 0v8.5A.75.75 0 0 1 8 12Z" />
                      <path d="M2.75 14.5a.75.75 0 0 1 0-1.5h10.5a.75.75 0 0 1 0 1.5H2.75Z" />
                    </svg>
                    Sample Template
                  </button>

                  <button
                    onClick={() => setIsUploadOpen(true)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #dddddd',
                      color: '#555555',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 hover:bg-[#f5f5f5] transition-colors"
                  >
                    <svg
                      className="shrink-0 w-4 h-4 mr-2"
                      style={{ fill: '#888888' }}
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 15H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h4v2H2v10h12V3h-3V1h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1ZM9 7h4l-5 5-5-5h4V1h2v6Z" />
                    </svg>
                    Import Excel
                  </button>

                  <button
                    onClick={handleAddNew}
                    style={{
                      background: '#03D985',
                      color: '#000000',
                      fontWeight: 700,
                      borderRadius: 8,
                      border: 'none',
                      fontSize: 14,
                    }}
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 hover:bg-[#02b870] transition-all transform hover:-translate-y-[1px] shadow-[0_4px_14px_rgba(3,217,133,0.25)]"
                  >
                    <svg className="w-4 h-4 shrink-0 mr-2" style={{ fill: '#000000' }} viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span>Add Industry</span>
                  </button>
                </div>
              )}
            </div>

            {id ? (
              <div style={{ flex: 1, minHeight: 0, paddingBottom: 16 }}>
                <Industry50LProfile
                  industryId={id}
                  goBack={() => navigate('/industries-50lplus')}
                  onEdit={handleEdit}
                  refreshTick={profileRefreshTick}
                />
              </div>
            ) : (
              <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e8', background: '#ffffff' }}>
                  <Industry50LFilters filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} />
                </div>

                {error && (
                  <div style={{ padding: 16, margin: 16, backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, fontSize: 14 }}>
                    {error}
                  </div>
                )}

                <Industry50LTable
                  data={data}
                  loading={loading}
                  pagination={pagination}
                  updateFilter={updateFilter}
                  onEdit={handleEdit}
                  onView={handleView}
                  refreshData={fetchIndustries50L}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <Industry50LFormModal isOpen={isFormOpen} onClose={handleFormCloseAndRefresh} industry={selectedIndustry} refreshData={fetchIndustries50L} />
      <Industry50LExcelUploader isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} refreshData={fetchIndustries50L} />
    </div>
  );
}

export default Industries50LPlus;