import React, { useState, useEffect } from 'react';
import { useAppToast } from '../../hooks/useAppToast';
import { infrastructureStatsApi } from '../../api/dashboardApi';
import AdminFormLayout, { inputStyle, labelStyle } from './AdminFormLayout';
import Card from '../../components/ui/Card';
import { INFRA_ICON_MAP } from '../../hooks/useDashboard'; // Reusing icon map from hook

const PRESETS = ['Literacy Rate', 'Youth (15-35)', 'No. of Colleges', 'No. of ITIs', 'Skill Centers', 'Road Connectivity', 'Internet Penetration'];

export default function InfrastructureStatsPage() {
  const [period, setPeriod] = useState("This Year (2024-25)");
  const [doc, setDoc] = useState(null);
  const [stats, setStats] = useState([]);
  const toast = useAppToast();   

  const fetchDoc = async () => {
    try {
      const pMap = { 'This Year (2024-25)': 'this_year', 'Last Year (2023-24)': 'last_year', 'Last 2 Years': 'last_2_years', 'Last 5 Years': 'last_5_years', 'Custom Range': 'custom' };
      const match = (await infrastructureStatsApi.getAll()).find(d => d.period === pMap[period]);
      if(match) { setDoc(match); setStats(match.stats); } else { setDoc(null); setStats([]); }
    } catch (err) { toast.error("Fetch failed"); }
  };

  useEffect(() => { fetchDoc(); }, [period]);     

  const handleSave = async () => {
    try {
      const payload = { period: period === 'This Year (2024-25)' ? 'this_year' : 'last_year', fiscalYear: '2024-25', stats };
      if(doc) { await infrastructureStatsApi.update(doc._id, payload); toast.success("Updated successfully"); }
      else { await infrastructureStatsApi.create(payload); toast.success("Created draft"); fetchDoc(); }
    } catch (err) { toast.error("Save failed. Require exactly 7 stats generally."); }
  };
  const handlePublish = async () => { if(doc) { await infrastructureStatsApi.publish(doc._id); toast.success("Live!"); fetchDoc(); } };

  return (
    <AdminFormLayout title="Infrastructure Stats" description="Manage Bottom Strip Metrics (7 Cards)" selectedPeriod={period} setSelectedPeriod={setPeriod}>
      <Card className="mb-6">
        <h3 className="text-[15px] font-bold text-[#111] mb-6 border-b border-[#e8e8e8] pb-3">Live Strip Preview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0 border border-[#e8e8e8] rounded-lg overflow-hidden bg-white">
          {stats.sort((a,b) => a.displayOrder - b.displayOrder).map((stat, idx) => {
            const Icon = INFRA_ICON_MAP[stat.label] || INFRA_ICON_MAP['Literacy Rate'];
            const isLast = idx === stats.length - 1;
            return (
              <div key={idx} className="flex flex-row items-center gap-3 px-3 py-4 transition-colors duration-200" style={{ borderRight: isLast ? 'none' : '1px solid #e8e8e8' }}>
                <div className="w-9 h-9 rounded-lg bg-[#03D98518] flex items-center justify-center shrink-0"><Icon style={{ width: 18, height: 18, color: '#03D985' }} /></div>
                <div className="flex flex-col justify-center truncate">
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#111111' }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: '#888888', marginTop: 2 }} className="truncate">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex justify-between items-center mb-6"><h3 className="text-[15px] font-bold text-[#111]">Stats Array (Should be 7)</h3><button onClick={() => setStats([...stats, { label: PRESETS[0], value: '0', displayOrder: stats.length + 1 }])} style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#555', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>+ Add Stat</button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="flex gap-3 items-end p-4 bg-[#f9fafb] border border-[#f0f0f0] rounded-lg">
              <div className="flex-1">
                <label style={labelStyle}>Label (Preset)</label>
                <select style={inputStyle} value={s.label} onChange={e => { const n = [...stats]; n[i].label = e.target.value; setStats(n); }}>
                  {PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
                  <option value={s.label}>{s.label} (Custom)</option>
                </select>
              </div>
              <div className="w-[30%]"><label style={labelStyle}>Value</label><input style={inputStyle} value={s.value} onChange={e => { const n = [...stats]; n[i].value = e.target.value; setStats(n); }} placeholder="e.g. 79.3%" /></div>
              <div className="w-[15%]"><label style={labelStyle}>Order</label><input type="number" style={inputStyle} value={s.displayOrder} onChange={e => { const n = [...stats]; n[i].displayOrder = Number(e.target.value); setStats(n); }} /></div>
              <button onClick={() => setStats(stats.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center shrink-0 bg-[#fef2f2] text-[#ef4444] rounded-lg mb-0.5">✕</button>
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-3 border-t border-[#e8e8e8] pt-5">
          <button onClick={handleSave} style={{ background: '#03D985', color: '#000', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Save Form</button>
          {doc && <button onClick={handlePublish} style={{ background: '#111', color: '#fff', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Publish Live</button>}
        </div>
      </Card>
    </AdminFormLayout>
  );
}