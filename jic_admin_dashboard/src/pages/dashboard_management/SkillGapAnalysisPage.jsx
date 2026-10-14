import React, { useState, useEffect } from 'react';
import { useAppToast } from '../../hooks/useAppToast';
import { skillGapApi } from '../../api/dashboardApi';
import AdminFormLayout, { inputStyle, labelStyle } from './AdminFormLayout';
import Card from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SkillGapAnalysisPage() {
  const [period, setPeriod] = useState("This Year (2024-25)");
  const [doc, setDoc] = useState(null);
  const [skills, setSkills] = useState([]);
  const toast = useAppToast();

  const fetchDoc = async () => {   
    try {  
      const pMap = { 'This Year (2024-25)': 'this_year', 'Last Year (2023-24)': 'last_year', 'Last 2 Years': 'last_2_years', 'Last 5 Years': 'last_5_years', 'Custom Range': 'custom' };
      const match = (await skillGapApi.getAll()).find(d => d.period === pMap[period]);
      if(match) { setDoc(match); setSkills(match.skills); } else { setDoc(null); setSkills([]); }
    } catch (err) { toast.error("Fetch failed"); }
  };
    
  useEffect(() => { fetchDoc(); }, [period]);

  const handleSave = async () => {
    try {
      const PERIOD_MAP = {
        'This Year (2024-25)': 'this_year',
        'Last Year (2023-24)': 'last_year',
        'Last 2 Years': 'last_2_years',
        'Last 5 Years': 'last_5_years',
        'Custom Range': 'custom',
      };
      const FISCAL_YEAR_MAP = {
        'This Year (2024-25)': '2024-25',
        'Last Year (2023-24)': '2023-24',
        'Last 2 Years': '2023-25',
        'Last 5 Years': '2020-25',
        'Custom Range': 'Custom',
      };
      const payload = {
        period: PERIOD_MAP[period] || 'this_year',
        fiscalYear: FISCAL_YEAR_MAP[period] || '2024-25',
        skills,
      };
      if(doc) { await skillGapApi.update(doc._id, payload); toast.success("Updated successfully"); }
      else { await skillGapApi.create(payload); toast.success("Created draft"); fetchDoc(); }
    } catch (err) { toast.error("Save failed"); }
  };

  const handlePublish = async () => { if(doc) { await skillGapApi.publish(doc._id); toast.success("Live!"); fetchDoc(); } };

  return (
    <AdminFormLayout title="Skill Gap Analysis" description="Demand vs Available Skilled Resources" selectedPeriod={period} setSelectedPeriod={setPeriod}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-[#111]">Skills Array</h3>
            <button onClick={() => setSkills([...skills, { skill:'', demand:0, available:0, displayOrder: skills.length + 1 }])} style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#555', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>+ Add Skill</button>
          </div>
          <div className="flex flex-col gap-4">
            {skills.map((sk, i) => (
              <div key={i} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-4 bg-[#f9fafb] border border-[#f0f0f0] rounded-lg relative">
                <div className="absolute top-2 right-2 text-[11px] font-bold text-[#888]">Gap: {sk.demand - sk.available}</div>
                <div className="w-full md:w-[30%]">
                  <label style={labelStyle}>Skill / Sector</label>
                  <input 
                    style={inputStyle} 
                    value={sk.skill} 
                    onChange={e => {
                      const val = e.target.value;
                      setSkills(prev => prev.map((item, idx) =>
                        idx === i ? { ...item, skill: val } : item
                      ));
                    }} 
                    onFocus={e => e.target.style.borderColor = '#03D985'}
                    onBlur={e => e.target.style.borderColor = '#dddddd'}
                  />
                </div>
                <div className="w-full md:w-[25%]">
                  <label style={labelStyle}>Demand</label>
                  <input 
                    type="number" 
                    style={inputStyle} 
                    value={sk.demand} 
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSkills(prev => prev.map((item, idx) =>
                        idx === i ? { ...item, demand: val } : item
                      ));
                    }} 
                    onFocus={e => e.target.style.borderColor = '#03D985'}
                    onBlur={e => e.target.style.borderColor = '#dddddd'}
                  />
                </div>
                <div className="w-full md:w-[25%]">
                  <label style={labelStyle}>Available</label>
                  <input 
                    type="number" 
                    style={inputStyle} 
                    value={sk.available} 
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSkills(prev => prev.map((item, idx) =>
                        idx === i ? { ...item, available: val } : item
                      ));
                    }} 
                    onFocus={e => e.target.style.borderColor = '#03D985'}
                    onBlur={e => e.target.style.borderColor = '#dddddd'}
                  />
                </div>
                <div className="w-full md:w-[20%]">
                  <label style={labelStyle}>Order</label>
                  <input 
                    type="number" 
                    style={inputStyle} 
                    value={sk.displayOrder} 
                    onChange={e => {
                      const val = Number(e.target.value);
                      setSkills(prev => prev.map((item, idx) =>
                        idx === i ? { ...item, displayOrder: val } : item
                      ));
                    }} 
                    onFocus={e => e.target.style.borderColor = '#03D985'}
                    onBlur={e => e.target.style.borderColor = '#dddddd'}
                  />
                </div>
                <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center shrink-0 bg-[#fef2f2] border border-[#fecaca] text-[#ef4444] rounded-lg mb-0.5">✕</button>
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
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skills} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis dataKey="skill" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#555', width: 60 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="demand" name="Demand" fill="#3b82f6" radius={[0,3,3,0]} barSize={10} />
                <Bar dataKey="available" name="Available" fill="#03D985" radius={[0,3,3,0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AdminFormLayout>
  );
}