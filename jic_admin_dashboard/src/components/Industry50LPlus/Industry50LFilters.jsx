import React, { useState, useEffect } from 'react';

export default function Industry50LFilters({ filters, updateFilter, resetFilters }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        updateFilter('search', searchTerm);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, updateFilter]);

  useEffect(() => {
    if (!filters.search) setSearchTerm('');
  }, [filters.search]);

  const inputStyle = {
    background: '#ffffff', border: '1px solid #dddddd', borderRadius: 8, color: '#555555', padding: '8px 12px', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', width: '100%'
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4" style={{ color: '#aaaaaa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="search"
            placeholder="Search by Company, Owner/CEO, City, Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, background: '#f5f5f5', color: '#333333', paddingLeft: 36 }}
            onFocus={(e) => { e.target.style.borderColor = '#03D985'; e.target.style.background = '#ffffff'; }}
            onBlur={(e) => { e.target.style.borderColor = '#dddddd'; e.target.style.background = '#f5f5f5'; }}
          />
        </div>
        
        <div className="sm:w-1/6">
          <input 
            type="text" 
            placeholder="Filter by City" 
            value={filters.city} 
            onChange={(e) => updateFilter('city', e.target.value)} 
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#03D985'}
            onBlur={(e) => e.target.style.borderColor = '#dddddd'}
          />
        </div>

        <div className="sm:w-1/6">
          <input 
            type="text" 
            placeholder="Filter by District" 
            value={filters.district} 
            onChange={(e) => updateFilter('district', e.target.value)} 
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#03D985'}
            onBlur={(e) => e.target.style.borderColor = '#dddddd'}
          />
        </div>
        
        <div className="sm:w-1/5">
          <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#03D985'} onBlur={(e) => e.target.style.borderColor = '#dddddd'}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Verified">Verified</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="w-full">
          <input 
            type="text" 
            placeholder="Business Category" 
            value={filters.businessCategory} 
            onChange={(e) => updateFilter('businessCategory', e.target.value)} 
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#03D985'}
            onBlur={(e) => e.target.style.borderColor = '#dddddd'}
          />
        </div>

        <div className="w-full">
          <input 
            type="text" 
            placeholder="Industry Type" 
            value={filters.industryType} 
            onChange={(e) => updateFilter('industryType', e.target.value)} 
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#03D985'}
            onBlur={(e) => e.target.style.borderColor = '#dddddd'}
          />
        </div>

        <div className="w-full">
          <select value={filters.ecommerceEnabled} onChange={(e) => updateFilter('ecommerceEnabled', e.target.value)} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#03D985'} onBlur={(e) => e.target.style.borderColor = '#dddddd'}>
            <option value="">Ecommerce Enabled (All)</option>
            <option value="true">Ecommerce Enabled</option>
            <option value="false">Not Enabled</option>
          </select>
        </div>

        <div className="w-full">
          <select value={filters.gstRegistered} onChange={(e) => updateFilter('gstRegistered', e.target.value)} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#03D985'} onBlur={(e) => e.target.style.borderColor = '#dddddd'}>
            <option value="">GST Registered (All)</option>
            <option value="true">GST Registered</option>
            <option value="false">Not Registered</option>
          </select>
        </div>

        <div className="w-full">
          <select value={filters.exportsCurrently} onChange={(e) => updateFilter('exportsCurrently', e.target.value)} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#03D985'} onBlur={(e) => e.target.style.borderColor = '#dddddd'}>
            <option value="">Exports Currently (All)</option>
            <option value="true">Currently Exporting</option>
            <option value="false">Not Exporting</option>
          </select>
        </div>
        
        <button 
          onClick={resetFilters} 
          style={{ color: '#ef4444', border: '1px solid #e8e8e8', background: '#ffffff', borderRadius: 8, fontSize: 14, fontWeight: 500, padding: '8px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
          className="shrink-0 w-full hover:bg-[#fef2f2]"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}