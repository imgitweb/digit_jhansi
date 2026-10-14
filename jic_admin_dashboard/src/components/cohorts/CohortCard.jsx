// src/components/cohorts/CohortCard.jsx
import React, { useState } from 'react';

export default function CohortCard({ cohort, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Active': return { bg: 'rgba(3,217,133,0.12)', color: '#02b870', border: '1px solid rgba(3,217,133,0.3)' };
      case 'Planned': return { bg: 'rgba(255,193,7,0.12)', color: '#b08800', border: '1px solid rgba(255,193,7,0.3)' };
      case 'Completed': return { bg: 'rgba(59,130,246,0.12)', color: '#1d4ed8', border: '1px solid rgba(59,130,246,0.3)' };
      case 'Cancelled': return { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.3)' };
      default: return { bg: '#f5f5f5', color: '#888', border: '1px solid #ddd' };
    }
  };

  const statusStyle = getStatusStyle(cohort.status);
  const formattedDate = cohort.startDate ? new Date(cohort.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-xl border p-4 sm:p-5 cursor-pointer transition-all duration-200 flex flex-col w-full ${isHovered ? 'border-[#03D985] shadow-[0_4px_20px_rgba(3,217,133,0.10)]' : 'border-[#e5e7eb]'}`}
      style={{ fontFamily: 'var(--font-sora)' }}
    >
      {/* Header Row: Title & Badge */}
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1 min-w-0"> {/* min-w-0 allows truncate to work inside flex */}
          <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111111] mb-1 leading-snug truncate">
            {cohort.name}
          </h3>
          <p className="text-[12px] text-[#888888] m-0 truncate">
            {cohort.category}
          </p>
        </div>
        <div 
          className="shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap"
          style={{ background: statusStyle.bg, color: statusStyle.color, border: statusStyle.border }}
        >
          {cohort.status}
        </div>
      </div>

      {/* Skill Tag */}
      {cohort.primarySkill && (
        <div className="mb-4">
          <span className="inline-block bg-[#f5f5f5] border border-[#dddddd] rounded-md px-2.5 py-1 text-[11px] sm:text-[12px] text-[#555555] font-medium truncate max-w-full">
            {cohort.primarySkill}
          </span>
        </div>
      )}

      {/* Stats Grid - 3 columns perfectly aligned */}
      <div className="grid grid-cols-3 gap-2 border-t border-[#f0f0f0] pt-3.5 mt-auto">
        <div className="text-left">
          <div className="text-[15px] sm:text-lg font-bold text-[#111111] truncate">{cohort.totalMembers || 0}</div>
          <div className="text-[10px] sm:text-[11px] text-[#888888] font-medium mt-0.5">Members</div>
        </div>
        <div className="text-left">
          <div className="text-[13px] sm:text-[14px] font-bold text-[#111111] truncate">{formattedDate}</div>
          <div className="text-[10px] sm:text-[11px] text-[#888888] font-medium mt-0.5">Start Date</div>
        </div>
        <div className="text-right">
          <div className="text-[15px] sm:text-lg font-bold text-[#111111] truncate">0%</div>
          <div className="text-[10px] sm:text-[11px] text-[#888888] font-medium mt-0.5">Progress</div>
        </div>
      </div>

      {/* Footer Row */}
      <div className="flex justify-between items-center mt-4 gap-2">
        <span className="text-[11px] sm:text-xs text-[#888888] font-medium truncate">
          {cohort.mentor ? `Mentor: ${cohort.mentor}` : 'No mentor assigned'}
        </span>
        <span className={`shrink-0 text-[#03D985] text-[12px] sm:text-[13px] font-semibold transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
          View Details →
        </span>
      </div>
    </div>
  );
}