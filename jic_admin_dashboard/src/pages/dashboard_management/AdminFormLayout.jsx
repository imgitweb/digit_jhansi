import React, { useState } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import { ChevronDown, Plus, Trash2, Globe, FileEdit } from 'lucide-react';

export const inputStyle = { border: '1px solid #dddddd', borderRadius: 8, background: '#ffffff', color: '#333333', padding: '8px 12px', fontSize: 13, outline: 'none', width: '100%', transition: 'border-color 0.2s' };
export const labelStyle = { fontSize: 13, fontWeight: 600, color: '#555555', marginBottom: 4, display: 'block' };

export default function AdminFormLayout({ title, description, selectedPeriod, setSelectedPeriod, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">      
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bg-[#f5f5f5] main-content-scroll">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-2 sm:px-3 lg:px-5 pt-3 pb-8 w-full max-w-[1920px] mx-auto">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-[26px] font-bold text-[#111] mb-1">{title}</h1>
                <p className="text-[14px] text-[#888] m-0">{description}</p>
              </div>
              <div className="relative w-full sm:w-auto">
                <select className="w-full sm:min-w-[220px]" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} style={{ appearance: 'none', background: '#ffffff', border: '1px solid #dddddd', borderRadius: 8, padding: '8px 36px 8px 14px', fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                  <option>This Year (2025-26)</option><option>Last Year (2024-25)</option><option>Last 2 Years</option><option>Last 5 Years</option><option>Custom Range</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#888] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}