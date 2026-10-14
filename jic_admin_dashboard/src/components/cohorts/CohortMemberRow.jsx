// src/components/cohorts/CohortMemberRow.jsx
import React from 'react';

const getStatusBadge = (status) => {
  const map = {
    Active: { bg: 'rgba(3,217,133,0.12)', color: '#02b870', border: '1px solid rgba(3,217,133,0.3)' },
    Inactive: { bg: '#f5f5f5', color: '#888888', border: '1px solid #dddddd' },
    Placed: { bg: 'rgba(59,130,246,0.12)', color: '#1d4ed8', border: '1px solid rgba(59,130,246,0.3)' },
    Blacklisted: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.3)' }
  };
  return map[status] || map['Inactive'];
};

export default function CohortMemberRow({ member, index }) {
  const badgeStyle = getStatusBadge(member.status);

  return (
    <tr 
      className="border-b border-[#f0f0f0] transition-colors duration-200 hover:bg-[#fafafa]"
    >
      {/* whitespace-nowrap prevents cell content from wrapping and looking squished on scroll */}
      <td className="px-4 sm:px-6 py-3 sm:py-4 text-[12px] sm:text-[13px] text-[#888888] whitespace-nowrap">
        {index + 1}
      </td>
      <td className="px-4 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
        <div className="text-[12px] sm:text-[13px] font-bold text-[#111111]">{member.fullName}</div>
        <div className="text-[11px] sm:text-[12px] text-[#888888] mt-0.5 sm:mt-1">{member.phoneNumber}</div>
      </td>
      <td className="px-4 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
        <span className="bg-[#f5f5f5] px-2 py-1 rounded-[4px] text-[10px] sm:text-[11px] text-[#555555] border border-[#e5e7eb] font-mono">
          {member._id.slice(-6).toUpperCase()}
        </span>
      </td>
      <td className="px-4 sm:px-4 py-3 sm:py-4 text-[12px] sm:text-[13px] text-[#333333] font-medium whitespace-nowrap">
        {member.skills?.primary?.name || '—'}
      </td>
      <td className="px-4 sm:px-4 py-3 sm:py-4 text-[12px] sm:text-[13px] text-[#333333] font-medium whitespace-nowrap">
        {member.address?.block || '—'}
      </td>
      <td className="px-4 sm:px-4 py-3 sm:py-4 text-[12px] sm:text-[13px] text-[#333333] font-medium whitespace-nowrap">
        {member.employment?.currentStatus || '—'}
      </td>
      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
        <span 
          className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold whitespace-nowrap"
          style={{ 
            background: badgeStyle.bg, 
            color: badgeStyle.color, 
            border: badgeStyle.border 
          }}
        >
          {member.status || 'Inactive'}
        </span>
      </td>
    </tr>
  );
}