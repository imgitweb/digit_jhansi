import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Transition from '../utils/Transition';
import axiosInstance from '../api/axiosInstance';

export default function ModalSearch({ id, searchId, modalOpen, setModalOpen }) {
  const modalContent = useRef(null);
  const searchInput = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // Internal State
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [results, setResults] = useState({
    resources: [], riders: [], enablers: [], under50l: [], plus50l: []
  });

  // Modules setup for Quick Nav and Icons
  const modules = [
    { key: 'resources', label: 'Resource Hub', description: 'Talent & skill pool', path: '/resources', color: 'text-[#03D985]', 
      icon: <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" /> },
    { key: 'riders', label: 'Riders Database', description: 'Delivery workforce', path: '/riders', color: 'text-[#03D985]', 
      icon: <path d="M6.753 2.659a1 1 0 0 0-1.506-1.317L2.451 4.537l-.744-.744A1 1 0 1 0 .293 5.207l1.5 1.5a1 1 0 0 0 1.46-.048l3.5-4ZM6.753 10.659a1 1 0 1 0-1.506-1.317l-2.796 3.195-.744-.744a1 1 0 0 0-1.414 1.414l1.5 1.5a1 1 0 0 0 1.46-.049l3.5-4ZM8 4.5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1ZM9 11.5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" /> },
    { key: 'enablers', label: 'Ecommerce Enablers', description: 'Digital service agencies', path: '/enablers', color: 'text-[#03D985]', 
      icon: <path d="M9 6.855A3.502 3.502 0 0 0 8 0a3.5 3.5 0 0 0-1 6.855v1.656L5.534 9.65a3.5 3.5 0 1 0 1.229 1.578L8 10.267l1.238.962a3.5 3.5 0 1 0 1.229-1.578L9 8.511V6.855ZM6.5 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4.803 8.095c.005-.005.01-.01.013-.016l.012-.016a1.5 1.5 0 1 1-.025.032ZM3.5 11c.474 0 .897.22 1.171.563l.013.016.013.017A1.5 1.5 0 1 1 3.5 11Z" /> },
    { key: 'under50l', label: 'Industry (<50L)', description: 'MSMEs & small businesses', path: '/industries-under50l', color: 'text-[#03D985]', 
      icon: <path d="M14.75 2.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM14.75 16a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM2.5 14.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM1.25 2.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z" /> },
    { key: 'plus50l', label: 'Industry (50L+)', description: 'Enterprise industries', path: '/industries-50lplus', color: 'text-[#03D985]', 
      icon: <path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2ZM4 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" /> },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">Active</span>;
      case 'Inactive': return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#fef2f2] text-[#ef4444] border border-[#fecaca]">Inactive</span>;
      case 'Verified': return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#eff6ff] text-[#3b82f6] border border-[#bfdbfe]">Verified</span>;
      case 'Placed': return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">Placed</span>;
      case 'Suspended': return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#fffbeb] text-[#f59e0b] border border-[#fde68a]">Suspended</span>;
      default: return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#f5f5f5] text-[#888] border border-[#e8e8e8]">{status}</span>;
    }
  };

  // --- API LOGIC ---
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ resources: [], riders: [], enablers: [], under50l: [], plus50l: [] });
      setTotalCount(0);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const params = { search: searchQuery, limit: 4 };
    
    try {
      const [resRes, riderRes, enablerRes, under50Res, plus50Res] = await Promise.allSettled([
        axiosInstance.get('/resources', { params }),
        axiosInstance.get('/riders', { params }),
        axiosInstance.get('/enablers', { params }),
        axiosInstance.get('/industries-under50l', { params }),
        axiosInstance.get('/industries-50lplus', { params }),
      ]);

      const extract = (settled) => settled.status === 'fulfilled' ? (settled.value.data?.data || []) : [];
      
      const newResults = {
        resources: extract(resRes),
        riders: extract(riderRes),
        enablers: extract(enablerRes),
        under50l: extract(under50Res),
        plus50l: extract(plus50Res),
      };
      
      setResults(newResults);
      setTotalCount(Object.values(newResults).reduce((sum, arr) => sum + arr.length, 0));
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim()) {
      debounceRef.current = setTimeout(() => performSearch(query), 350);
    } else {
      setResults({ resources: [], riders: [], enablers: [], under50l: [], plus50l: [] });
      setTotalCount(0);
      setIsSearching(false);
    }
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // --- EVENT HANDLERS ---
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current?.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [modalOpen, setModalOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [modalOpen, setModalOpen]);

  useEffect(() => {
    if (modalOpen) {
      setQuery('');
      setResults({ resources: [], riders: [], enablers: [], under50l: [], plus50l: [] });
      setTotalCount(0);
      setTimeout(() => searchInput.current?.focus(), 50);
    }
  }, [modalOpen]);

  const handleNavigate = (path) => {
    navigate(path);
    setModalOpen(false);
  };

  // --- RENDER HELPERS ---
  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#e8e8e8] last:border-0 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-[#f0f0f0] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-[#f0f0f0] rounded w-2/3" />
          <div className="h-3 bg-[#f0f0f0] rounded w-1/3" />
        </div>
      </div>
    ))
  );

  const renderSectionHeader = (moduleKey) => {
    const mod = modules.find(m => m.key === moduleKey);
    const count = results[moduleKey].length;
    if (count === 0 && !isSearching) return null;

    return (
      <div className="flex items-center justify-between px-4 py-2 bg-[#fafafa] border-b border-[#e8e8e8] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <svg className={`w-4 h-4 fill-current ${mod.color}`} viewBox="0 0 16 16">{mod.icon}</svg>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">
            {mod.label}
          </span>
          {!isSearching && (
            <span className="text-xs font-medium text-[#aaa]">({count})</span>
          )}
        </div>
        <button onClick={() => handleNavigate(mod.path)} className="text-xs text-[#03D985] hover:text-[#02b870] font-semibold">
          View all &rarr;
        </button>
      </div>
    );
  };

  return (
    <>
      <Transition
        className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[9998] transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200" enterStart="opacity-0" enterEnd="opacity-100"
        leave="transition ease-out duration-100" leaveStart="opacity-100" leaveEnd="opacity-0"
        aria-hidden="true"
      />
      
      <Transition
        id={id}
        className="fixed inset-0 z-[9999] overflow-y-auto px-3 sm:px-4 pt-12 sm:pt-16 lg:pt-24 pb-4 flex justify-center items-start"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200" enterStart="opacity-0 translate-y-4 scale-95" enterEnd="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in-out duration-200" leaveStart="opacity-100 translate-y-0 scale-100" leaveEnd="opacity-0 translate-y-4 scale-95"
      >
        <div
          ref={modalContent}
          className="relative max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl w-full bg-white rounded-xl shadow-[0_24px_80px_rgba(0,0,0,0.15)] border border-[#e8e8e8] flex flex-col max-h-[85vh] sm:max-h-[80vh] lg:max-h-[75vh] overflow-hidden"
        >
          {/* SEARCH INPUT ROW */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e8e8e8] shrink-0 relative bg-white">
            <svg className="shrink-0 fill-current text-[#03D985] w-5 h-5" viewBox="0 0 16 16">
              <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
              <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
            </svg>
            <input
              id={searchId}
              ref={searchInput}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources, riders, companies..."
              className="flex-1 bg-transparent text-[#111] placeholder-[#aaa] text-[15px] outline-none border-0 focus:ring-0 p-0"
            />
            {isSearching && (
              <svg className="animate-spin h-5 w-5 text-[#03D985] shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {query.trim() && !isSearching && (
              <span className="text-[11px] font-bold text-[#888] bg-[#f0f0f0] px-2 py-0.5 rounded-full shrink-0">
                {totalCount} result{totalCount !== 1 && 's'}
              </span>
            )}
          </div>

          {/* SCROLLABLE RESULTS AREA */}
          <div className="overflow-y-auto flex-1 bg-white">
            {!query.trim() ? (
              // QUICK NAVIGATION
              <div className="p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-3 px-1">
                  Quick Navigation
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {modules.map(mod => (
                    <button
                      key={mod.key}
                      onClick={() => handleNavigate(mod.path)}
                      className="flex items-center gap-3 p-3 rounded-[8px] bg-[#f9fafb] border border-[#e8e8e8] hover:bg-[rgba(3,217,133,0.04)] hover:border-[#03D985] transition-all duration-150 text-left cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#e8e8e8] flex items-center justify-center shrink-0 ${mod.color}`}>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">{mod.icon}</svg>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#111] leading-tight">{mod.label}</p>
                        <p className="text-[11px] text-[#888] leading-tight mt-0.5">{mod.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : isSearching ? (
              // LOADING SKELETONS
              <div>
                {renderSectionHeader('resources')}
                {renderSkeleton()}
              </div>
            ) : totalCount === 0 ? (
              // FULL EMPTY STATE
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white">
                <svg className="w-12 h-12 text-[#ddd] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="9" y1="9" x2="13" y2="13"></line>
                  <line x1="13" y1="9" x2="9" y2="13"></line>
                </svg>
                <p className="text-[15px] font-bold text-[#111]">No results found</p>
                <p className="text-[13px] text-[#888] mt-1">Try searching by name, phone, block, or category</p>
              </div>
            ) : (
              // RESULTS LIST
              <div>
                {/* Resources */}
                {results.resources.length > 0 && (
                  <div>
                    {renderSectionHeader('resources')}
                    {results.resources.map(item => (
                      <button key={item._id} onClick={() => handleNavigate(`/resources/${item._id}`)} className="w-full flex items-center gap-3 px-4 py-2.5 sm:py-3 hover:bg-[rgba(3,217,133,0.04)] border-b border-[#e8e8e8] last:border-0 text-left transition-colors duration-100 group bg-white">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#111] truncate">{item.fullName}</p>
                          <div className="flex items-center text-[11px] text-[#888] mt-0.5 truncate">
                            <span className="font-medium text-[#03D985]">{item.skills?.primary?.name || 'No Primary Skill'}</span>
                            <span className="mx-1.5 text-[#ddd]">&bull;</span>
                            <span className="truncate">{item.address?.block || 'Unknown Block'}</span>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">{getStatusBadge(item.status)}</div>
                        <span className="hidden lg:block shrink-0 text-[#aaa] group-hover:text-[#03D985] transition-colors ml-1">&rarr;</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Riders */}
                {results.riders.length > 0 && (
                  <div>
                    {renderSectionHeader('riders')}
                    {results.riders.map(item => (
                      <button key={item._id} onClick={() => handleNavigate(`/riders/${item._id}`)} className="w-full flex items-center gap-3 px-4 py-2.5 sm:py-3 hover:bg-[rgba(3,217,133,0.04)] border-b border-[#e8e8e8] last:border-0 text-left transition-colors duration-100 group bg-white">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#111] truncate">{item.fullName}</p>
                          <div className="flex items-center text-[11px] text-[#888] mt-0.5 truncate">
                            <span className="font-medium text-[#03D985]">{item.platform?.primary || 'No Platform'}</span>
                            <span className="mx-1.5 text-[#ddd]">&bull;</span>
                            <span className="truncate">{item.city || 'Unknown City'}</span>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">{getStatusBadge(item.status)}</div>
                        <span className="hidden lg:block shrink-0 text-[#aaa] group-hover:text-[#03D985] transition-colors ml-1">&rarr;</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Enablers */}
                {results.enablers.length > 0 && (
                  <div>
                    {renderSectionHeader('enablers')}
                    {results.enablers.map(item => (
                      <button key={item._id} onClick={() => handleNavigate(`/enablers/${item._id}`)} className="w-full flex items-center gap-3 px-4 py-2.5 sm:py-3 hover:bg-[rgba(3,217,133,0.04)] border-b border-[#e8e8e8] last:border-0 text-left transition-colors duration-100 group bg-white">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#111] truncate">{item.companyName}</p>
                          <div className="flex items-center text-[11px] text-[#888] mt-0.5 truncate">
                            <span className="font-medium text-[#03D985]">{item.ownerName || 'No Owner Listed'}</span>
                            <span className="mx-1.5 text-[#ddd]">&bull;</span>
                            <span className="truncate">{item.address?.city || 'Unknown City'}</span>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">{getStatusBadge(item.status)}</div>
                        <span className="hidden lg:block shrink-0 text-[#aaa] group-hover:text-[#03D985] transition-colors ml-1">&rarr;</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Industry Under 50L */}
                {results.under50l.length > 0 && (
                  <div>
                    {renderSectionHeader('under50l')}
                    {results.under50l.map(item => (
                      <button key={item._id} onClick={() => handleNavigate(`/industries-under50l/${item._id}`)} className="w-full flex items-center gap-3 px-4 py-2.5 sm:py-3 hover:bg-[rgba(3,217,133,0.04)] border-b border-[#e8e8e8] last:border-0 text-left transition-colors duration-100 group bg-white">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#111] truncate">{item.companyName}</p>
                          <div className="flex items-center text-[11px] text-[#888] mt-0.5 truncate">
                            <span className="font-medium text-[#03D985]">{item.businessCategory || 'No Category'}</span>
                            <span className="mx-1.5 text-[#ddd]">&bull;</span>
                            <span className="truncate">{item.address?.block || 'Unknown Block'}</span>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">{getStatusBadge(item.status)}</div>
                        <span className="hidden lg:block shrink-0 text-[#aaa] group-hover:text-[#03D985] transition-colors ml-1">&rarr;</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Industry 50L Plus */}
                {results.plus50l.length > 0 && (
                  <div>
                    {renderSectionHeader('plus50l')}
                    {results.plus50l.map(item => (
                      <button key={item._id} onClick={() => handleNavigate(`/industries-50lplus/${item._id}`)} className="w-full flex items-center gap-3 px-4 py-2.5 sm:py-3 hover:bg-[rgba(3,217,133,0.04)] border-b border-[#e8e8e8] last:border-0 text-left transition-colors duration-100 group bg-white">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#111] truncate">{item.companyName}</p>
                          <div className="flex items-center text-[11px] text-[#888] mt-0.5 truncate">
                            <span className="font-medium text-[#03D985]">{item.businessCategory || 'No Category'}</span>
                            <span className="mx-1.5 text-[#ddd]">&bull;</span>
                            <span className="truncate">{item.address?.city || 'Unknown City'}</span>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">{getStatusBadge(item.status)}</div>
                        <span className="hidden lg:block shrink-0 text-[#aaa] group-hover:text-[#03D985] transition-colors ml-1">&rarr;</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e8e8e8] bg-[#fafafa] shrink-0">
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#888]">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-[#efefef] border border-[#ddd] rounded shadow-sm font-mono font-medium text-[#555]">&crarr;</kbd>
                to select
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-[#efefef] border border-[#ddd] rounded shadow-sm font-mono font-medium text-[#555]">ESC</kbd>
                to close
              </span>
            </div>
            <div className="sm:hidden flex items-center gap-1.5 text-[11px] text-[#888]">
              <kbd className="px-1.5 py-0.5 bg-[#efefef] border border-[#ddd] rounded shadow-sm font-mono font-medium text-[#555]">ESC</kbd> to close
            </div>
            <span className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider hidden sm:block">
              Satna PRD Search
            </span>
          </div>
        </div>
      </Transition>
    </>
  );
}