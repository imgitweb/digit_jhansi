// src/pages/CohortDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { getCohortById } from '../api/cohortApi';
import CohortMemberRow from '../components/cohorts/CohortMemberRow';

export default function CohortDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('resources');

  useEffect(() => {
    fetchCohortData();
  }, [id]);

  const fetchCohortData = async () => {
    try {
      setLoading(true);
      const response = await getCohortById(id);
      if (response.success) {
        setCohort(response.data);
      } else {
        throw new Error('Failed to fetch cohort');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Active': return { bg: 'rgba(3,217,133,0.12)', color: '#02b870', border: '1px solid rgba(3,217,133,0.3)' };
      case 'Planned': return { bg: 'rgba(255,193,7,0.12)', color: '#b08800', border: '1px solid rgba(255,193,7,0.3)' };
      case 'Completed': return { bg: 'rgba(59,130,246,0.12)', color: '#1d4ed8', border: '1px solid rgba(59,130,246,0.3)' };
      case 'Cancelled': return { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.3)' };
      default: return { bg: '#f5f5f5', color: '#888', border: '1px solid #ddd' };
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div 
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 main-content-scroll"
        style={{ background: '#f5f5f5', fontFamily: 'var(--font-sora)' }}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="p-4 sm:p-6 lg:p-8 min-h-screen max-w-[1400px] mx-auto w-full">
            
            {/* Back Button */}
            <button 
              onClick={() => navigate(-1)}
              className="bg-transparent border-none text-[#888888] text-[13px] font-medium cursor-pointer p-0 mb-4 sm:mb-5 flex items-center gap-1.5 hover:text-[#555555] transition-colors"
            >
              ← Back to Cohorts
            </button>

            {loading ? (
              <div className="flex justify-center py-20 sm:py-24">
                <div className="w-10 h-10 border-[3px] border-[#e5e7eb] border-t-[#03D985] rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="p-4 bg-[#fef2f2] text-[#ef4444] border border-[#fecaca] rounded-lg text-sm font-medium">{error}</div>
            ) : cohort && (
              <>
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-1.5">
                      <h1 className="text-xl sm:text-[22px] font-bold text-[#111111] m-0 leading-tight break-words">{cohort.name}</h1>
                      <div 
                        className="shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold"
                        style={{ background: getStatusStyle(cohort.status).bg, color: getStatusStyle(cohort.status).color, border: getStatusStyle(cohort.status).border }}
                      >
                        {cohort.status}
                      </div>
                    </div>
                    <p className="text-[13px] sm:text-[14px] text-[#888888] m-0 break-words">
                      {cohort.category} {cohort.primarySkill ? ` · ${cohort.primarySkill}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <button className="w-full sm:w-auto bg-[#ffffff] border border-[#dddddd] text-[#111111] rounded-lg px-4 py-2 sm:px-4 sm:py-2 text-[13px] font-semibold hover:bg-gray-50 transition-colors">
                      Edit Cohort
                    </button>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 sm:p-5">
                    <div className="text-2xl sm:text-[28px] font-bold text-[#03D985] leading-none truncate">{cohort.members?.length || 0}</div>
                    <div className="text-[11px] sm:text-[13px] text-[#888888] mt-2 font-medium">Total Members</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 sm:p-5">
                    <div className="text-[15px] sm:text-[18px] font-bold text-[#111111] leading-tight mt-1 sm:mt-2 truncate">{cohort.mentor || '—'}</div>
                    <div className="text-[11px] sm:text-[13px] text-[#888888] mt-1.5 sm:mt-2 font-medium">Mentor Assigned</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 sm:p-5">
                    <div className="text-[15px] sm:text-[18px] font-bold text-[#111111] leading-tight mt-1 sm:mt-2 truncate">
                      {cohort.startDate ? new Date(cohort.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                    </div>
                    <div className="text-[11px] sm:text-[13px] text-[#888888] mt-1.5 sm:mt-2 font-medium">Start Date</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 sm:p-5">
                    <div className="text-2xl sm:text-[28px] font-bold text-[#111111] leading-none truncate">0%</div>
                    <div className="text-[11px] sm:text-[13px] text-[#888888] mt-2 font-medium">Progress</div>
                  </div>
                </div>

                {cohort.description && (
                  <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 sm:p-5 mb-6">
                    <h3 className="text-[13px] sm:text-[14px] font-bold text-[#111111] m-0 mb-2">Description</h3>
                    <p className="text-[13px] sm:text-[14px] text-[#555555] m-0 leading-relaxed">{cohort.description}</p>
                  </div>
                )}

                {/* Tabs - Added overflow-x-auto to make it horizontally scrollable on mobile */}
                <div className="border-b-2 border-[#e5e7eb] flex gap-6 sm:gap-8 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {['overview', 'resources', 'training', 'progress'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="bg-transparent border-none cursor-pointer pb-3 text-[13px] sm:text-[14px] capitalize transition-colors"
                      style={{
                        fontWeight: activeTab === tab ? 600 : 500,
                        color: activeTab === tab ? '#03D985' : '#888888',
                        borderBottom: `2px solid ${activeTab === tab ? '#03D985' : 'transparent'}`,
                        marginBottom: -2
                      }}
                    >
                      {tab} {tab === 'resources' && `(${cohort.members?.length || 0})`}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e7eb] p-4 sm:p-6">
                      <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111111] m-0 mb-4 sm:mb-5">Cohort Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-4">
                        <div><div className="text-[11px] sm:text-[12px] text-[#888888] mb-1 font-medium">Category</div><div className="text-[13px] sm:text-[14px] font-semibold text-[#111111] break-words">{cohort.category}</div></div>
                        <div><div className="text-[11px] sm:text-[12px] text-[#888888] mb-1 font-medium">Primary Skill</div><div className="text-[13px] sm:text-[14px] font-semibold text-[#111111] break-words">{cohort.primarySkill || '—'}</div></div>
                        <div><div className="text-[11px] sm:text-[12px] text-[#888888] mb-1 font-medium">Status</div><div className="text-[13px] sm:text-[14px] font-semibold text-[#111111] break-words">{cohort.status}</div></div>
                        <div><div className="text-[11px] sm:text-[12px] text-[#888888] mb-1 font-medium">Mentor</div><div className="text-[13px] sm:text-[14px] font-semibold text-[#111111] break-words">{cohort.mentor || '—'}</div></div>
                        <div><div className="text-[11px] sm:text-[12px] text-[#888888] mb-1 font-medium">Start Date</div><div className="text-[13px] sm:text-[14px] font-semibold text-[#111111] break-words">{cohort.startDate ? new Date(cohort.startDate).toLocaleDateString('en-IN') : '—'}</div></div>
                        <div><div className="text-[11px] sm:text-[12px] text-[#888888] mb-1 font-medium">End Date</div><div className="text-[13px] sm:text-[14px] font-semibold text-[#111111] break-words">{cohort.endDate ? new Date(cohort.endDate).toLocaleDateString('en-IN') : '—'}</div></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 sm:p-6">
                      <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111111] m-0 mb-4 sm:mb-5">Quick Stats</h3>
                      <div className="mb-6">
                        <div className="text-[28px] sm:text-[32px] font-bold text-[#03D985] leading-none">{cohort.members?.length || 0}</div>
                        <div className="text-[12px] sm:text-[13px] text-[#888888] mt-1.5 sm:mt-2 font-medium">Total Members Enrolled</div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-[12px] sm:text-[13px] font-semibold">
                          <span className="text-[#111111]">Course Progress</span>
                          <span className="text-[#03D985]">0%</span>
                        </div>
                        <div className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                          <div className="h-full w-[0%] bg-[#03D985] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden flex flex-col w-full">
                    <div className="p-4 sm:p-5 border-b border-[#e5e7eb]">
                      <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111111] m-0">Members ({cohort.members?.length || 0})</h3>
                      <p className="text-[12px] sm:text-[13px] text-[#888888] m-0 mt-1">Resources assigned to this cohort</p>
                    </div>
                    
                    {cohort.members?.length > 0 ? (
                      /* Table wrapper with overflow-x-auto to make table responsive */
                      <div className="overflow-x-auto w-full">
                        <table className="w-full min-w-[700px] border-collapse text-left">
                          <thead>
                            <tr className="bg-[#f9f9f9] border-b border-[#e5e7eb]">
                              <th className="px-4 sm:px-6 py-3 text-[10px] sm:text-[11px] font-bold text-[#888888] uppercase tracking-wider whitespace-nowrap">#</th>
                              <th className="px-4 sm:px-4 py-3 text-[10px] sm:text-[11px] font-bold text-[#888888] uppercase tracking-wider whitespace-nowrap">Name & Contact</th>
                              <th className="px-4 sm:px-4 py-3 text-[10px] sm:text-[11px] font-bold text-[#888888] uppercase tracking-wider whitespace-nowrap">Resource ID</th>
                              <th className="px-4 sm:px-4 py-3 text-[10px] sm:text-[11px] font-bold text-[#888888] uppercase tracking-wider whitespace-nowrap">Primary Skill</th>
                              <th className="px-4 sm:px-4 py-3 text-[10px] sm:text-[11px] font-bold text-[#888888] uppercase tracking-wider whitespace-nowrap">Block</th>
                              <th className="px-4 sm:px-4 py-3 text-[10px] sm:text-[11px] font-bold text-[#888888] uppercase tracking-wider whitespace-nowrap">Employment</th>
                              <th className="px-4 sm:px-6 py-3 text-[10px] sm:text-[11px] font-bold text-[#888888] uppercase tracking-wider whitespace-nowrap">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cohort.members.map((member, index) => (
                              <CohortMemberRow key={member._id} member={member} index={index} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-12 sm:py-16 px-4 text-center text-[#888888] text-[13px] sm:text-[14px]">
                        No resources assigned yet.
                      </div>
                    )}
                  </div>
                )}

                {(activeTab === 'training' || activeTab === 'progress') && (
                  <div className="bg-white rounded-xl border border-[#e5e7eb] py-16 sm:py-20 px-4 sm:px-6 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[rgba(3,217,133,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#03D985" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h3 className="text-[16px] sm:text-[18px] font-bold text-[#111111] m-0 mb-2">
                      {activeTab === 'training' ? 'Training Modules' : 'Progress Tracking'}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-[#888888] m-0 max-w-[400px] mx-auto leading-relaxed">
                      {activeTab === 'training' 
                        ? 'Training session management will be available in the next version.' 
                        : 'Attendance, assessment, and progress tracking coming soon.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}