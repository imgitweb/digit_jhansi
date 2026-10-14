import React, { useState, useEffect } from 'react';
import { useAppToast } from '../../hooks/useAppToast';
import { getKPIsAll, updateKPI, publishKPI, unpublishKPI } from '../../api/dashboardApi';
import AdminFormLayout, { inputStyle, labelStyle } from './AdminFormLayout';
import Card from '../../components/ui/Card';
import { Pencil } from 'lucide-react';

export default function SummaryKPIsPage() {
  const [period, setPeriod] = useState("This Year (2024-25)");
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useAppToast();

  // Inline Editing State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});  
  const [saving, setSaving] = useState(false);   

  const fetchKpis = async () => {
    setLoading(true);
    try {    
      const pMap = { 
        'This Year (2024-25)': 'this_year', 
        'Last Year (2023-24)': 'last_year', 
        'Last 2 Years': 'last_2_years', 
        'Last 5 Years': 'last_5_years', 
        'Custom Range': 'custom' 
      };
      const data = await getKPIsAll();
      setKpis(data.filter(k => k.period === pMap[period]));
    } catch (err) { 
      toast.error("Failed to load KPIs"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchKpis(); 
    // Reset editing state when period changes
    setEditingId(null);
    setEditForm({});
  }, [period]);

  const togglePublish = async (id, currentStatus) => {
    try {
      currentStatus === 'published' ? await unpublishKPI(id) : await publishKPI(id);
      toast.success(currentStatus === 'published' ? "KPI Unpublished" : "KPI Published successfully");
      fetchKpis();
    } catch (err) { 
      toast.error("Status update failed"); 
    }
  };

  const handleEditClick = (kpi) => {
    setEditingId(kpi._id);
    setEditForm({
      title: kpi.title,
      value: kpi.value,
      prefix: kpi.prefix || '',
      suffix: kpi.suffix || '',
      growth: kpi.growth,
      trend: kpi.trend
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (field, val) => {
    setEditForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (kpi) => {
    setSaving(true);
    try {
      const payload = {
        title: editForm.title,
        value: Number(editForm.value),
        prefix: editForm.prefix,
        suffix: editForm.suffix,
        growth: Number(editForm.growth),
        trend: editForm.trend,
        displayOrder: kpi.displayOrder,
        fiscalYear: kpi.fiscalYear,
        period: kpi.period,
        key: kpi.key,
      };
      await updateKPI(kpi._id, payload);
      toast.success(`${editForm.title} updated successfully`);
      setEditingId(null);
      setEditForm({});
      await fetchKpis();
    } catch (err) {
      toast.error(err.message || 'Failed to update KPI');
    } finally {
      setSaving(false);
    }
  };

  // Optimized styles for inline edit inputs
  const editInputStyle = { 
    ...inputStyle, 
    padding: '5px 8px', 
    fontSize: 13, 
    minWidth: 0 
  };
  
  const focusProps = {
    onFocus: (e) => (e.target.style.borderColor = '#03D985'),
    onBlur: (e) => (e.target.style.borderColor = '#dddddd')
  };

  return (
    <AdminFormLayout 
      title="KPI Management" 
      description="Manage top-level dashboard metrics" 
      selectedPeriod={period} 
      setSelectedPeriod={setPeriod}
    >
      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03D985]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e8e8e8] text-[13px] text-[#888]">
                  <th className="py-3 px-4 font-semibold w-10">#</th>
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Prefix</th>
                  <th className="py-3 px-4 font-semibold">Value</th>
                  <th className="py-3 px-4 font-semibold">Suffix</th>
                  <th className="py-3 px-4 font-semibold">Growth %</th>
                  <th className="py-3 px-4 font-semibold">Trend</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right min-w-[200px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kpis.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-[#888]">
                      No KPIs found for this period
                    </td>
                  </tr>
                ) : (
                  kpis.map(kpi => {
                    const isEditing = editingId === kpi._id;

                    return (
                      <tr 
                        key={kpi._id} 
                        className="border-b border-[#f5f5f5] transition-colors duration-150"
                        style={{ background: isEditing ? '#f0fdf4' : 'transparent' }}
                      >
                        {/* Column 1: Order (#) - Always Readonly */}
                        <td className="py-3 px-4 text-[#888] text-[12px]">{kpi.displayOrder}</td>

                        {isEditing ? (
                          /* ---------------- EDIT MODE CELLS ---------------- */
                          <>
                            <td className="py-3 px-4">
                              <input 
                                style={{ ...editInputStyle, minWidth: '120px' }} 
                                value={editForm.title} 
                                onChange={e => handleEditChange('title', e.target.value)} 
                                {...focusProps} 
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input 
                                style={{ ...editInputStyle, minWidth: '50px' }} 
                                value={editForm.prefix} 
                                onChange={e => handleEditChange('prefix', e.target.value)} 
                                {...focusProps} 
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input 
                                type="number" 
                                style={{ ...editInputStyle, minWidth: '80px' }} 
                                value={editForm.value} 
                                onChange={e => handleEditChange('value', e.target.value)} 
                                {...focusProps} 
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input 
                                style={{ ...editInputStyle, minWidth: '50px' }} 
                                value={editForm.suffix} 
                                onChange={e => handleEditChange('suffix', e.target.value)} 
                                {...focusProps} 
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input 
                                type="number" 
                                step="0.1" 
                                style={{ ...editInputStyle, minWidth: '70px' }} 
                                value={editForm.growth} 
                                onChange={e => handleEditChange('growth', e.target.value)} 
                                {...focusProps} 
                              />
                            </td>
                            <td className="py-3 px-4">
                              <select 
                                style={{ ...editInputStyle, minWidth: '80px' }} 
                                value={editForm.trend} 
                                onChange={e => handleEditChange('trend', e.target.value)} 
                                {...focusProps}
                              >
                                <option value="up">↑ Up</option>
                                <option value="down">↓ Down</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <span style={kpi.status === 'published' 
                                ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 } 
                                : { background: '#fafafa', color: '#888', border: '1px solid #e8e8e8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                                {kpi.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button 
                                onClick={() => handleSave(kpi)} 
                                disabled={saving}
                                style={{ background: '#03D985', color: '#000', fontWeight: 700, borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: saving ? 'not-allowed' : 'pointer', border: 'none', opacity: saving ? 0.6 : 1, marginRight: 8 }}
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button 
                                onClick={handleCancelEdit} 
                                disabled={saving}
                                style={{ background: '#fff', color: '#555', fontWeight: 600, borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: saving ? 'not-allowed' : 'pointer', border: '1px solid #e8e8e8' }}
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          /* ---------------- VIEW MODE CELLS ---------------- */
                          <>
                            <td className="py-3 px-4 text-[14px] font-medium text-[#111]">{kpi.title}</td>
                            <td className="py-3 px-4 text-[14px] text-[#555]">{kpi.prefix || '—'}</td>
                            <td className="py-3 px-4 text-[14px] font-semibold text-[#111]">{kpi.value.toLocaleString('en-IN')}</td>
                            <td className="py-3 px-4 text-[14px] text-[#555]">{kpi.suffix || '—'}</td>
                            <td className="py-3 px-4 text-[14px] text-[#555]">{kpi.growth}%</td>
                            <td className="py-3 px-4">
                              {kpi.trend === 'up' ? (
                                <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 600 }}>↑ Up</span>
                              ) : (
                                <span style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 600 }}>↓ Down</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span style={kpi.status === 'published' 
                                ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 } 
                                : { background: '#fafafa', color: '#888', border: '1px solid #e8e8e8', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
                                {kpi.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button 
                                onClick={() => handleEditClick(kpi)} 
                                style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#555', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 16 }}
                              >
                                <Pencil size={12} /> Edit
                              </button>
                              <button 
                                onClick={() => togglePublish(kpi._id, kpi.status)} 
                                className="text-[13px] font-semibold text-[#03D985] hover:underline"
                              >
                                {kpi.status === 'published' ? 'Unpublish' : 'Publish'}
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminFormLayout>
  );
}