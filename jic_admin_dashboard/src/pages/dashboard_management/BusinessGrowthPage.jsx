import React, { useState, useEffect } from 'react';
import { useAppToast } from '../../hooks/useAppToast';
import { businessGrowthApi } from '../../api/dashboardApi';
import AdminFormLayout, { inputStyle, labelStyle } from './AdminFormLayout';
import Card from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DEFAULT_MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'].map((m, i) => ({ month: m, newReg: 0, active: 0, monthOrder: i + 1 }));

export default function BusinessGrowthPage() {      
  const [period, setPeriod] = useState("This Year (2024-25)");   
  const [doc, setDoc] = useState(null);
  const [monthlyData, setMonthlyData] = useState(DEFAULT_MONTHS);
  const toast = useAppToast();

  const fetchDoc = async () => {
    try {
      const pMap = { 'This Year (2024-25)': 'this_year', 'Last Year (2023-24)': 'last_year', 'Last 2 Years': 'last_2_years', 'Last 5 Years': 'last_5_years', 'Custom Range': 'custom' };
      const data = await businessGrowthApi.getAll();
      const match = data.find(d => d.period === pMap[period]);
      if(match) { setDoc(match); setMonthlyData(match.monthlyData.length === 12 ? match.monthlyData : DEFAULT_MONTHS); } 
      else { setDoc(null); setMonthlyData(DEFAULT_MONTHS); }
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
        monthlyData,
      };
      if(doc) { await businessGrowthApi.update(doc._id, payload); toast.success("Updated successfully"); }
      else { await businessGrowthApi.create(payload); toast.success("Created draft"); fetchDoc(); }
    } catch (err) { toast.error("Save failed"); }
  };

  const handlePublish = async () => {
    if(!doc) return;
    try { await businessGrowthApi.publish(doc._id); toast.success("Live on Dashboard!"); fetchDoc(); } catch (err) { toast.error("Publish failed"); }
  };

  return (
    <AdminFormLayout title="Business Growth" description="Manage monthly registration vs active data" selectedPeriod={period} setSelectedPeriod={setPeriod}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-[15px] font-bold text-[#111] mb-6">Monthly Data (Fixed 12 Months)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {monthlyData.map((m, i) => (
                <div key={i} className="p-3 bg-[#f9fafb] border border-[#f0f0f0] rounded-lg">
                  <div className="font-bold text-[#111] mb-2">{m.month} <span className="text-[10px] font-normal text-[#888]">(Order: {m.monthOrder})</span></div>
                  
                  <label style={labelStyle}>New Reg</label>
                  <input 
                    type="number" 
                    style={{...inputStyle, marginBottom: 8}} 
                    value={m.newReg} 
                    onChange={e => {
                      const val = Number(e.target.value);
                      setMonthlyData(prev => prev.map((item, idx) =>
                        idx === i ? { ...item, newReg: val } : item
                      ));
                    }} 
                    onFocus={e => e.target.style.borderColor = '#03D985'}
                    onBlur={e => e.target.style.borderColor = '#dddddd'}
                  />
                  
                  <label style={labelStyle}>Active</label>
                  <input 
                    type="number" 
                    style={inputStyle} 
                    value={m.active} 
                    onChange={e => {
                      const val = Number(e.target.value);
                      setMonthlyData(prev => prev.map((item, idx) =>
                        idx === i ? { ...item, active: val } : item
                      ));
                    }} 
                    onFocus={e => e.target.style.borderColor = '#03D985'}
                    onBlur={e => e.target.style.borderColor = '#dddddd'}
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-3 border-t border-[#e8e8e8] pt-5">
              <button onClick={handleSave} style={{ background: '#03D985', color: '#000', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Save Form</button>
              {doc && <button onClick={handlePublish} style={{ background: '#111', color: '#fff', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Publish Live</button>}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card style={{ position: 'sticky', top: 20 }}>
            <h3 className="text-[15px] font-bold text-[#111] mb-6 border-b border-[#e8e8e8] pb-3">Live Preview</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={4} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="newReg" name="New Registrations" fill="#3b82f6" radius={[3,3,0,0]} />
                  <Bar dataKey="active" name="Active Businesses" fill="#03D985" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AdminFormLayout>
  );
}