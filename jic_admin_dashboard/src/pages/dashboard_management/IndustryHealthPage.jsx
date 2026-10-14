import React, { useState, useEffect } from 'react';
import { useAppToast } from '../../hooks/useAppToast';
import { industryHealthApi } from '../../api/dashboardApi';
import AdminFormLayout, { inputStyle, labelStyle } from './AdminFormLayout';
import Card from '../../components/ui/Card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const getScoreColor = (score) => score >= 70 ? '#03D985' : score >= 50 ? '#f59e0b' : '#ef4444';

export default function IndustryHealthPage() {
  const [period, setPeriod] = useState("This Year (2024-25)");
  const [doc, setDoc] = useState(null);
  const [industries, setIndustries] = useState([]);
  const toast = useAppToast();

  const fetchDoc = async () => {
    try {    
      const pMap = { 'This Year (2024-25)': 'this_year', 'Last Year (2023-24)': 'last_year', 'Last 2 Years': 'last_2_years', 'Last 5 Years': 'last_5_years', 'Custom Range': 'custom' };
      const match = (await industryHealthApi.getAll()).find(d => d.period === pMap[period]);
      if(match) { setDoc(match); setIndustries(match.industries); } else { setDoc(null); setIndustries([]); }
    } catch (err) { toast.error("Fetch failed"); }     
  };

  useEffect(() => { fetchDoc(); }, [period]);

  const handleSave = async () => {
    try {
      const payload = { period: period === 'This Year (2024-25)' ? 'this_year' : 'last_year', fiscalYear: '2024-25', industries };
      if(doc) { await industryHealthApi.update(doc._id, payload); toast.success("Updated successfully"); }
      else { await industryHealthApi.create(payload); toast.success("Created draft"); fetchDoc(); }
    } catch (err) { toast.error("Save failed. Ensure trend has exactly 15 numbers."); }
  };

  const handlePublish = async () => { if(doc) { await industryHealthApi.publish(doc._id); toast.success("Live!"); fetchDoc(); } };

  return (
    <AdminFormLayout title="Industry Health" description="Manage Health Scores & Sparkline Trends" selectedPeriod={period} setSelectedPeriod={setPeriod}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-6"><h3 className="text-[15px] font-bold text-[#111]">Health Array</h3><button onClick={() => setIndustries([...industries, { name:'', score:0, color:'#ef4444', trend: Array(15).fill(0), displayOrder: industries.length + 1 }])} style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#555', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>+ Add Industry</button></div>
          <div className="flex flex-col gap-4">
            {industries.map((ind, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 bg-[#f9fafb] border border-[#f0f0f0] rounded-lg">
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1"><label style={labelStyle}>Industry Name</label><input style={inputStyle} value={ind.name} onChange={e => { const n = [...industries]; n[i].name = e.target.value; setIndustries(n); }} /></div>
                  <div className="w-[20%]"><label style={labelStyle}>Score (0-100)</label><input type="number" style={inputStyle} value={ind.score} onChange={e => { const n = [...industries]; n[i].score = Number(e.target.value); n[i].color = getScoreColor(n[i].score); setIndustries(n); }} /></div>
                  <div className="w-[20%]"><label style={labelStyle}>Color</label><div className="h-[34px] rounded border border-[#ddd] flex items-center px-2 bg-white"><div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: ind.color }}></div><span className="text-[12px]">{ind.color}</span></div></div>
                  <div className="w-[15%]"><label style={labelStyle}>Order</label><input type="number" style={inputStyle} value={ind.displayOrder} onChange={e => { const n = [...industries]; n[i].displayOrder = Number(e.target.value); setIndustries(n); }} /></div>
                  <button onClick={() => setIndustries(industries.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center shrink-0 bg-[#fef2f2] text-[#ef4444] rounded-lg mb-0.5">✕</button>
                </div>
                <div><label style={labelStyle}>Trend Array (15 comma-separated numbers)</label><input style={inputStyle} value={ind.trend.join(',')} onChange={e => { const n = [...industries]; n[i].trend = e.target.value.split(',').map(v => Number(v.trim()) || 0); setIndustries(n); }} placeholder="e.g. 74,77,73,79,76,81,78,82,79,83,80,84,81,83,82" /></div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3 border-t border-[#e8e8e8] pt-5">
            <button onClick={handleSave} style={{ background: '#03D985', color: '#000', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Save Form</button>
            {doc && <button onClick={handlePublish} style={{ background: '#111', color: '#fff', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Publish Live</button>}
          </div>
        </Card>
        <Card style={{ position: 'sticky', top: 20 }}>
          <h3 className="text-[15px] font-bold text-[#111] mb-6 border-b border-[#e8e8e8] pb-3">Live Preview</h3>
          <div className="flex flex-col h-full">
            {industries.sort((a,b) => a.displayOrder - b.displayOrder).map((item, idx) => (
              <div key={`health-${idx}`} className="flex items-center py-[10px] border-b border-[#f0f0f0] last:border-0 w-full overflow-hidden">
                <span className="text-[13px] font-medium text-[#555] min-w-[130px] truncate">{item.name}</span>
                <span className="text-[13px] font-bold min-w-[28px] text-right shrink-0" style={{ color: item.color }}>{item.score}</span>
                <div className="flex-1 h-[36px] mx-[12px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={(item.trend || []).map(v => ({ v }))} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                      <Line type="monotone" dataKey="v" stroke={item.color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm" style={{ backgroundColor: item.color }}>{item.score}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminFormLayout>
  );
}