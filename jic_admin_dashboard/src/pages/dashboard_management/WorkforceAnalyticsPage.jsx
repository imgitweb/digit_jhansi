import React, { useState, useEffect } from 'react';
import { useAppToast } from '../../hooks/useAppToast';
import { workforceApi } from '../../api/dashboardApi';
import AdminFormLayout, { inputStyle, labelStyle } from './AdminFormLayout';
import Card from '../../components/ui/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function WorkforceAnalyticsPage() {
  const [period, setPeriod] = useState("This Year (2024-25)");
  const [doc, setDoc] = useState(null);
  const [topMetrics, setTopMetrics] = useState({ workingPopulation: 0, skilledWorkforce: 0, unemploymentRate: 0, femaleWorkforce: 0 });
  const [sectors, setSectors] = useState([]);
  const toast = useAppToast();

  const fetchDoc = async () => {   
    try {
      const pMap = { 'This Year (2024-25)': 'this_year', 'Last Year (2023-24)': 'last_year', 'Last 2 Years': 'last_2_years', 'Last 5 Years': 'last_5_years', 'Custom Range': 'custom' };
      const match = (await workforceApi.getAll()).find(d => d.period === pMap[period]);
      if(match) { 
        setDoc(match); setSectors(match.sectorDistribution);
        setTopMetrics({ workingPopulation: match.workingPopulation, skilledWorkforce: match.skilledWorkforce, unemploymentRate: match.unemploymentRate, femaleWorkforce: match.femaleWorkforce });
      } else { setDoc(null); setSectors([]); setTopMetrics({ workingPopulation: 0, skilledWorkforce: 0, unemploymentRate: 0, femaleWorkforce: 0 }); }
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
        ...topMetrics,
        sectorDistribution: sectors,
      };
      if(doc) { await workforceApi.update(doc._id, payload); toast.success("Updated successfully"); }
      else { await workforceApi.create(payload); toast.success("Created draft"); fetchDoc(); }
    } catch (err) { toast.error("Save failed"); }
  };

  const handlePublish = async () => { if(doc) { await workforceApi.publish(doc._id); toast.success("Live!"); fetchDoc(); } };

  return (
    <AdminFormLayout title="Workforce Analytics" description="Manage top metrics and sector distribution" selectedPeriod={period} setSelectedPeriod={setPeriod}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <h3 className="text-[15px] font-bold text-[#111] mb-4">Top Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Working Pop. (Lakhs)</label>
                <input 
                  type="number" 
                  style={inputStyle} 
                  value={topMetrics.workingPopulation} 
                  onChange={e => setTopMetrics({...topMetrics, workingPopulation: Number(e.target.value)})} 
                  onFocus={e => e.target.style.borderColor = '#03D985'}
                  onBlur={e => e.target.style.borderColor = '#dddddd'}
                />
              </div>
              <div>
                <label style={labelStyle}>Skilled Workforce (Lakhs)</label>
                <input 
                  type="number" 
                  style={inputStyle} 
                  value={topMetrics.skilledWorkforce} 
                  onChange={e => setTopMetrics({...topMetrics, skilledWorkforce: Number(e.target.value)})} 
                  onFocus={e => e.target.style.borderColor = '#03D985'}
                  onBlur={e => e.target.style.borderColor = '#dddddd'}
                />
              </div>
              <div>
                <label style={labelStyle}>Unemployment Rate (%)</label>
                <input 
                  type="number" 
                  style={inputStyle} 
                  value={topMetrics.unemploymentRate} 
                  onChange={e => setTopMetrics({...topMetrics, unemploymentRate: Number(e.target.value)})} 
                  onFocus={e => e.target.style.borderColor = '#03D985'}
                  onBlur={e => e.target.style.borderColor = '#dddddd'}
                />
              </div>
              <div>
                <label style={labelStyle}>Female Workforce (%)</label>
                <input 
                  type="number" 
                  style={inputStyle} 
                  value={topMetrics.femaleWorkforce} 
                  onChange={e => setTopMetrics({...topMetrics, femaleWorkforce: Number(e.target.value)})} 
                  onFocus={e => e.target.style.borderColor = '#03D985'}
                  onBlur={e => e.target.style.borderColor = '#dddddd'}
                />
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[15px] font-bold text-[#111]">Sector Distribution Array</h3>
              <button onClick={() => setSectors([...sectors, { name:'', value:0, color:'#03D985', displayOrder: sectors.length + 1 }])} style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#555', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>+ Add Sector</button>
            </div>
            <div className="flex flex-col gap-4">
              {sectors.map((sec, i) => (
                <div key={i} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-4 bg-[#f9fafb] border border-[#f0f0f0] rounded-lg">
                  <div className="w-full md:w-[35%]">
                    <label style={labelStyle}>Sector Name</label>
                    <input 
                      style={inputStyle} 
                      value={sec.name} 
                      onChange={e => {
                        const val = e.target.value;
                        setSectors(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, name: val } : item
                        ));
                      }} 
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <div className="w-full md:w-[20%]">
                    <label style={labelStyle}>Workforce %</label>
                    <input 
                      type="number" 
                      style={inputStyle} 
                      value={sec.value} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        setSectors(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, value: val } : item
                        ));
                      }} 
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <div className="w-full md:w-[25%]">
                    <label style={labelStyle}>Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="w-9 h-9 p-0 border-0 rounded" 
                        value={sec.color} 
                        onChange={e => {
                          const val = e.target.value;
                          setSectors(prev => prev.map((item, idx) =>
                            idx === i ? { ...item, color: val } : item
                          ));
                        }} 
                      />
                      <input 
                        style={{...inputStyle, padding: '4px 8px'}} 
                        value={sec.color} 
                        readOnly 
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-[20%]">
                    <label style={labelStyle}>Order</label>
                    <input 
                      type="number" 
                      style={inputStyle} 
                      value={sec.displayOrder} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        setSectors(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, displayOrder: val } : item
                        ));
                      }} 
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <button onClick={() => setSectors(sectors.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center shrink-0 bg-[#fef2f2] border border-[#fecaca] text-[#ef4444] rounded-lg mb-0.5">✕</button>
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
            <h3 className="text-[15px] font-bold text-[#111] mb-6 border-b border-[#e8e8e8] pb-3">Sector Preview</h3>
            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sectors} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={3} dataKey="value" stroke="none">
                    {sectors.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AdminFormLayout>
  );
}