import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import useResources from '../hooks/useResources';
import ResourceTable from '../components/ResourcePool/ResourceTable';
import ResourceFilters from '../components/ResourcePool/ResourceFilters';
import ResourceFormModal from '../components/ResourcePool/ResourceFormModal';
import ResourceProfile from '../components/ResourcePool/ResourceProfile';
import ExcelUploader from '../components/ResourcePool/ExcelUploader';
import { downloadResourceTemplate } from '../utils/templateDownloader';
import CreateCohortModal from '../components/cohorts/CreateCohortModal';

function ResourcePool() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, pagination, loading, error, filters, updateFilter, fetchResources, resetFilters } = useResources();

  const { id } = useParams();
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [profileRefreshTick, setProfileRefreshTick] = useState(0);

  // 2. ADD TO STATE DECLARATIONS INSIDE ResourcePool COMPONENT:
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showCohortModal, setShowCohortModal] = useState(false);

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setIsFormOpen(true);
  };

  const handleView = (resource) => {
    navigate(`/resources/${resource._id}`);
  };

  const handleAddNew = () => {
    setSelectedResource(null);
    setIsFormOpen(true);
  };

  const handleFormCloseAndRefresh = () => {
    setIsFormOpen(false);
    fetchResources();
    setProfileRefreshTick(prev => prev + 1);
  };

  // 3. ADD HANDLER FUNCTIONS INSIDE COMPONENT:
  const handleSelectOne = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === data.length && data.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map(r => r._id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Updated Wrapper to fix sidebar overlap issue */}
      <div
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out main-content-scroll main-content-scroll"
        style={{ background: '#f5f5f5' }}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Header Area */}
            <div className="sm:flex sm:flex-col sm:justify-between mb-8 md:flex md:flex-row md:jusbtify-between md:items-center lg:flex lg:justify-between lg:items-center">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-[22px] sm:text-[24px] font-bold text-[#111111] break-words">
                  {id ? 'Resource Details' : 'Resource Pool'}
                </h1>
              </div>
              {!id && (
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={downloadResourceTemplate}
                    style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, fontSize: 14, fontWeight: 600 }}
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 hover:bg-[#f5f5f5] transition-colors"
                  >
                    <svg className="shrink-0 w-4 h-4 mr-2" style={{ fill: '#888888' }} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 12a.75.75 0 0 1-.53-.22l-4-4a.75.75 0 1 1 1.06-1.06L8 10.19l3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4A.75.75 0 0 1 8 12Z" />
                      <path d="M8 12a.75.75 0 0 1-.75-.75v-8.5a.75.75 0 0 1 1.5 0v8.5A.75.75 0 0 1 8 12Z" />
                      <path d="M2.75 14.5a.75.75 0 0 1 0-1.5h10.5a.75.75 0 0 1 0 1.5H2.75Z" />
                    </svg>
                    Sample Template
                  </button>

                  <button
                    onClick={() => setIsUploadOpen(true)}
                    style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, fontSize: 14, fontWeight: 600 }}
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 hover:bg-[#f5f5f5] transition-colors"
                  >
                    <svg className="shrink-0 w-4 h-4 mr-2" style={{ fill: '#888888' }} viewBox="0 0 16 16">
                      <path d="M15 15H1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h4v2H2v10h12V3h-3V1h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1ZM9 7h4l-5 5-5-5h4V1h2v6Z" />
                    </svg>
                    Import Excel
                  </button>

                  <button
                    onClick={handleAddNew}
                    style={{ background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, border: 'none', fontSize: 14 }}
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 hover:bg-[#f5f5f5] transition-colors transform hover:-translate-y-[1px] shadow-[0_4px_14px_rgba(3,217,133,0.25)]"
                  >
                    <svg className="w-4 h-4 shrink-0 mr-2" style={{ fill: '#000000' }} viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span>Add Resource</span>
                  </button>
                </div>
              )}
            </div>

            {id ? (
              <ResourceProfile
                resourceId={id}
                goBack={() => navigate('/resources')}
                onEdit={handleEdit}
                refreshTick={profileRefreshTick}
              />
            ) : (
              <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e8e8', background: '#ffffff' }}>
                  <ResourceFilters filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} />
                </div>

                {error && (
                  <div style={{ padding: 16, margin: 16, backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, fontSize: 14 }}>
                    {error}
                  </div>
                )}

                {/* 4. INSERT ACTION BAR (Just ABOVE <ResourceTable /> inside the `!id` render block): */}
                {selectedIds.size > 0 && (
                  <div
                    className='sm:flex sm:flex-col sm:gap-4 sm:w-full sm:justify-between md:flex-row md:items-center md:justify-between'
                    style={{
                      // display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'rgba(3,217,133,0.06)', border: '1px solid rgba(3,217,133,0.25)',
                      borderRadius: 10, padding: '10px 16px', marginBottom: 12
                    }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#02b870' }}>
                      {selectedIds.size} Resource{selectedIds.size > 1 ? 's' : ''} Selected
                    </span>
                    <div
                      className="
                          flex flex-col gap-2 w-full mt-3
                          sm:flex-row sm:w-auto sm:items-center sm:justify-end sm:mt-0
                        "
                    >
                      <button
                        onClick={() => setShowCohortModal(true)}
                        className="btn btn-sm "
                        style={{ background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, padding: '6px 12px', border: 'none', cursor: 'pointer', fontSize: 13 }}
                      >
                        + Create Cohort
                      </button>
                      <button
                        onClick={clearSelection}
                        style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, padding: '5px 12px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                )}

                <ResourceTable
                  data={data}
                  loading={loading}
                  pagination={pagination}
                  updateFilter={updateFilter}
                  onEdit={handleEdit}
                  onView={handleView}
                  refreshData={fetchResources}
                  /* NEW PROPS BELOW */
                  selectedIds={selectedIds}
                  handleSelectAll={handleSelectAll}
                  handleSelectOne={handleSelectOne}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <ResourceFormModal isOpen={isFormOpen} onClose={handleFormCloseAndRefresh} resource={selectedResource} refreshData={fetchResources} />
      <ExcelUploader isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} refreshData={fetchResources} />
      <CreateCohortModal
        isOpen={showCohortModal}
        onClose={() => setShowCohortModal(false)}
        selectedResources={data.filter(r => selectedIds.has(r._id))}
        onSuccess={(newCohort) => {
          setShowCohortModal(false);
          clearSelection();
          navigate('/cohorts');
        }}
      />
    </div>
  );
}

export default ResourcePool;