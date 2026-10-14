import React, { useState, useEffect } from 'react';
import { useAppToast } from '../../hooks/useAppToast';
import { digitalAdoptionApi } from '../../api/dashboardApi';
import AdminFormLayout, { inputStyle, labelStyle } from './AdminFormLayout';
import Card from '../../components/ui/Card';

export default function DigitalAdoptionPage() {
  const [period, setPeriod] = useState("This Year (2024-25)");
  const [doc, setDoc] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const toast = useAppToast();

  const fetchDoc = async () => {   
    try {
      const pMap = { 'This Year (2024-25)': 'this_year', 'Last Year (2023-24)': 'last_year', 'Last 2 Years': 'last_2_years', 'Last 5 Years': 'last_5_years', 'Custom Range': 'custom' };
      const match = (await digitalAdoptionApi.getAll()).find(d => d.period === pMap[period]);
      if(match) { setDoc(match); setMetrics(match.metrics); } else { setDoc(null); setMetrics([]); }
    } catch (err) { toast.error("Fetch failed"); }
  };  
     
  useEffect(() => { fetchDoc(); }, [period]);

  const handleSave = async () => {
    try {
      const payload = { period: period === 'This Year (2024-25)' ? 'this_year' : 'last_year', fiscalYear: '2024-25', metrics };
      if(doc) { await digitalAdoptionApi.update(doc._id, payload); toast.success("Updated successfully"); }
      else { await digitalAdoptionApi.create(payload); toast.success("Created draft"); fetchDoc(); }
    } catch (err) { toast.error("Save failed"); }
  };

  const handlePublish = async () => { if(doc) { await digitalAdoptionApi.publish(doc._id); toast.success("Live!"); fetchDoc(); } };

  return (
    <AdminFormLayout title="Digital Adoption" description="Percentage of Businesses with digital tools" selectedPeriod={period} setSelectedPeriod={setPeriod}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-[#111]">Metrics Array</h3>
            <button onClick={() => setMetrics([...metrics, { label:'', pct:0, color:'#3b82f6', displayOrder: metrics.length + 1 }])} style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#555', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>+ Add Metric</button>
          </div>
          <div className="flex flex-col gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-4 bg-[#f9fafb] border border-[#f0f0f0] rounded-lg">
                <div className="w-full md:w-[35%]"><label style={labelStyle}>Label</label><input style={inputStyle} value={m.label} onChange={e => { const n = [...metrics]; n[i].label = e.target.value; setMetrics(n); }} /></div>
                <div className="w-full md:w-[20%]"><label style={labelStyle}>Pct (0-100)</label><input type="number" style={inputStyle} value={m.pct} onChange={e => { const n = [...metrics]; n[i].pct = Number(e.target.value); setMetrics(n); }} /></div>
                <div className="w-full md:w-[25%]"><label style={labelStyle}>Color</label><div className="flex gap-2"><input type="color" className="w-9 h-9 p-0 border-0 rounded" value={m.color} onChange={e => { const n = [...metrics]; n[i].color = e.target.value; setMetrics(n); }} /><input style={{...inputStyle, padding: '4px 8px'}} value={m.color} readOnly /></div></div>
                <div className="w-full md:w-[20%]"><label style={labelStyle}>Order</label><input type="number" style={inputStyle} value={m.displayOrder} onChange={e => { const n = [...metrics]; n[i].displayOrder = Number(e.target.value); setMetrics(n); }} /></div>
                <button onClick={() => setMetrics(metrics.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center shrink-0 bg-[#fef2f2] border border-[#fecaca] text-[#ef4444] rounded-lg mb-0.5">✕</button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3 border-t border-[#e8e8e8] pt-5">
            <button onClick={handleSave} style={{ background: '#03D985', color: '#000', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Save Form</button>
            {doc && <button onClick={handlePublish} style={{ background: '#111', color: '#fff', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Publish Live</button>}
          </div>
        </Card>
        <Card style={{ position: 'sticky', top: 20 }}>
          <h3 className="text-[15px] font-bold text-[#111] mb-6 border-b border-[#e8e8e8] pb-3">Live Progress Bars Preview</h3>
          <div className="flex flex-col justify-center h-full pb-4">
            {metrics.sort((a,b) => a.displayOrder - b.displayOrder).map((item, idx) => (
              <div key={idx} className="mb-[14px]">
                <div className="flex justify-between items-center mb-[6px]"><span className="text-[13px] text-[#555]">{item.label}</span><span className="text-[13px] font-bold text-[#111]">{item.pct}%</span></div>
                <div className="h-2 bg-[#f0f0f0] rounded-full w-full"><div className="h-full rounded-full transition-all duration-500" style={{ background: item.color, width: `${item.pct}%` }}></div></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminFormLayout>
  );
}