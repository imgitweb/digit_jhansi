// src/components/ResourcePool/ResourceTable.jsx
import React, { useState } from 'react';
import * as api from '../../api/resourceApi';
import { useAppToast } from '../../hooks/useAppToast';

export default function ResourceTable({
  data, loading, pagination, updateFilter, onEdit, onView, refreshData,
  selectedIds, handleSelectAll, handleSelectOne
}) {
  const toast = useAppToast();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const handleConfirmDelete = async (id) => {
    try {
      setDeleteError(null);
      await api.deleteResource(id);
      setDeletingId(null);
      refreshData();
      toast.success('Resource deleted');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete resource');
      setDeletingId(null);
      toast.error(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  const getStatusBadge = (status) => {
    const baseStyle = { borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, display: 'inline-flex' };
    switch (status) {
      case 'Active': return <span style={{ ...baseStyle, background: 'rgba(3,217,133,0.08)', color: '#16a34a' }}>Active</span>;
      case 'Inactive': return <span style={{ ...baseStyle, background: '#f5f5f5', color: '#888888' }}>Inactive</span>;
      case 'Placed': return <span style={{ ...baseStyle, background: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}>Placed</span>;
      case 'Blacklisted': return <span style={{ ...baseStyle, background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>Blacklisted</span>;
      default: return <span style={{ ...baseStyle, background: '#f5f5f5', color: '#888888' }}>{status || 'Unknown'}</span>;
    }
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
            <th style={{ width: 40, padding: '12px 8px 12px 16px' }}>
              <input
                type="checkbox"
                className="form-checkbox accent-[#03D985]"
                style={{ width: 16, height: 16, cursor: 'pointer' }}
                checked={selectedIds?.size === data.length && data.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th style={{ padding: '12px 20px', color: '#888888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name</th>
            <th style={{ padding: '12px 20px', color: '#888888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contact</th>
            <th style={{ padding: '12px 20px', color: '#888888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location</th>
            <th style={{ padding: '12px 20px', color: '#888888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Primary Skill</th>
            <th style={{ padding: '12px 20px', color: '#888888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>Status</th>
            <th style={{ padding: '12px 20px', color: '#888888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse" style={{ borderBottom: '1px solid #e8e8e8' }}>
                {/* Skeleton for checkbox */}
                <td style={{ padding: '12px 8px 12px 16px' }}>
                  <div style={{ height: 16, width: 16, background: '#f0f0f0', borderRadius: 4 }}></div>
                </td>
                <td style={{ padding: '16px 20px' }}><div style={{ height: 16, background: '#f0f0f0', borderRadius: 4, width: '75%' }}></div></td>
                <td style={{ padding: '16px 20px' }}><div style={{ height: 16, background: '#f0f0f0', borderRadius: 4, width: '50%' }}></div></td>
                <td style={{ padding: '16px 20px' }}><div style={{ height: 16, background: '#f0f0f0', borderRadius: 4, width: '100%' }}></div></td>
                <td style={{ padding: '16px 20px' }}><div style={{ height: 16, background: '#f0f0f0', borderRadius: 4, width: '66%' }}></div></td>
                <td style={{ padding: '16px 20px' }}><div style={{ height: 16, background: '#f0f0f0', borderRadius: 4, width: 48, margin: '0 auto' }}></div></td>
                <td style={{ padding: '16px 20px' }}><div style={{ height: 16, background: '#f0f0f0', borderRadius: 4, width: 64, marginLeft: 'auto' }}></div></td>
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: '32px 20px', textAlign: 'center', color: '#888888', fontSize: 14 }}>
                No resources found matching your filters.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row._id}
                onClick={() => onView(row)}
                className="cursor-pointer transition-colors duration-150"
                style={{ borderBottom: '1px solid #e8e8e8', background: deletingId === row._id ? '#fef2f2' : '#ffffff' }}
                onMouseEnter={(e) => { if (deletingId !== row._id) e.currentTarget.style.background = '#f9fafb'; }}
                onMouseLeave={(e) => { if (deletingId !== row._id) e.currentTarget.style.background = '#ffffff'; }}
              >
                {/* REAL Checkbox for data row */}
                <td style={{ padding: '12px 8px 12px 16px' }} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="form-checkbox accent-[#03D985]"
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                    checked={selectedIds?.has(row._id)}
                    onChange={() => handleSelectOne(row._id)}
                  />
                </td>
                <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                  <div style={{ fontWeight: 600, color: '#111111', fontSize: 14 }}>{row.fullName}</div>
                  <div style={{ fontSize: 11, color: '#aaaaaa' }}>{row.resourceId}</div>
                </td>
                <td style={{ padding: '14px 20px', whiteSpace: 'nowrap', color: '#555555', fontSize: 14 }}>
                  <div>{row.phoneNumber}</div>
                  <div style={{ fontSize: 12 }}>{row.email}</div>
                </td>
                <td style={{ padding: '14px 20px', whiteSpace: 'nowrap', color: '#555555', fontSize: 14 }}>
                  {row.address?.village || row.address?.block || 'N/A'}
                </td>
                <td style={{ padding: '14px 20px', whiteSpace: 'nowrap', color: '#555555', fontSize: 14 }}>
                  {row.skills?.primary?.name || 'N/A'}
                </td>
                <td style={{ padding: '14px 20px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {getStatusBadge(row.status)}
                </td>
                <td style={{ padding: '14px 20px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                  {deletingId === row._id ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#ef4444' }}>Confirm?</span>
                      <button onClick={(e) => { e.stopPropagation(); handleConfirmDelete(row._id); }} style={{ background: '#ef4444', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Yes</button>
                      <button onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} style={{ background: '#f5f5f5', color: '#555', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>No</button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); onView(row); }}
                      style={{ color: '#03D985', border: '1px solid #e8e8e8', padding: '4px 10px', borderRadius: 6, background: 'transparent', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#03D985'; e.currentTarget.style.background = 'rgba(3,217,133,0.04)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {deleteError && (
        <div style={{ padding: '12px 20px', background: '#fef2f2', borderTop: '1px solid #fecaca' }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#ef4444', margin: 0 }}>{deleteError}</p>
        </div>
      )}

      {/* Pagination */}
      <div style={{ padding: '12px 20px', background: '#fafafa', borderTop: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, color: '#888888' }}>
          Showing <span style={{ fontWeight: 600, color: '#111111' }}>{pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> to <span style={{ fontWeight: 600, color: '#111111' }}>{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span style={{ fontWeight: 600, color: '#111111' }}>{pagination.total}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            disabled={pagination.page <= 1}
            onClick={() => updateFilter('page', pagination.page - 1)}
            style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, padding: '4px 12px', fontSize: 13, fontWeight: 500, cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.4 : 1 }}
          >
            Prev
          </button>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => updateFilter('page', pagination.page + 1)}
            style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, padding: '4px 12px', fontSize: 13, fontWeight: 500, cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.totalPages ? 0.4 : 1 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}