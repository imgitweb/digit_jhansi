import React, { useState, useEffect } from 'react';
import { useAppToast } from '../../hooks/useAppToast';
import { industryDistributionApi } from '../../api/dashboardApi';
import AdminFormLayout, { inputStyle, labelStyle } from './AdminFormLayout';
import Card from '../../components/ui/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function IndustryDistributionPage() {
  const [period, setPeriod] = useState("This Year (2024-25)");
  const [doc, setDoc] = useState(null);
  const [industries, setIndustries] = useState([]);
  const toast = useAppToast();

  const fetchDoc = async () => {
    try {   
      const pMap = { 
        'This Year (2024-25)': 'this_year',     
        'Last Year (2023-24)': 'last_year', 
        'Last 2 Years': 'last_2_years', 
        'Last 5 Years': 'last_5_years', 
        'Custom Range': 'custom' 
      };
      const data = await industryDistributionApi.getAll();
      const match = data.find(d => d.period === pMap[period]);
      if(match) { 
        setDoc(match); 
        setIndustries(match.industries); 
      } else { 
        setDoc(null); 
        setIndustries([]); 
      }
    } catch (err) { 
      toast.error("Fetch failed"); 
    }
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
        industries 
      };
      
      if(doc) { 
        await industryDistributionApi.update(doc._id, payload); 
        toast.success("Updated successfully"); 
      } else { 
        await industryDistributionApi.create(payload); 
        toast.success("Created draft successfully"); 
        fetchDoc(); 
      }
    } catch (err) { 
      toast.error("Save failed"); 
    }
  };

  const handlePublish = async () => {
    if(!doc) return;
    try { 
      await industryDistributionApi.publish(doc._id); 
      toast.success("Live on Dashboard!"); 
      fetchDoc(); 
    } catch (err) { 
      toast.error("Publish failed"); 
    }
  };

  return (
    <AdminFormLayout title="Industry Distribution" description="Manage Donut Chart Data" selectedPeriod={period} setSelectedPeriod={setPeriod}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[15px] font-bold text-[#111]">Industries Array</h3>
              <button 
                onClick={() => setIndustries([...industries, { name:'', value:0, pct:'0%', color:'#03D985', displayOrder: industries.length + 1 }])} 
                style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#555', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}
              >
                + Add Industry
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {industries.map((ind, i) => (
                <div key={i} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-4 bg-[#f9fafb] border border-[#f0f0f0] rounded-lg">
                  <div className="w-full md:w-[30%]">
                    <label style={labelStyle}>Name</label>
                    <input 
                      style={inputStyle} 
                      value={ind.name} 
                      onChange={e => {
                        setIndustries(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, name: e.target.value } : item
                        ));
                      }}
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <div className="w-full md:w-[20%]">
                    <label style={labelStyle}>Count</label>
                    <input 
                      type="number" 
                      style={inputStyle} 
                      value={ind.value} 
                      onChange={e => {
                        setIndustries(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, value: Number(e.target.value) } : item
                        ));
                      }}
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <div className="w-full md:w-[20%]">
                    <label style={labelStyle}>Percentage</label>
                    <input 
                      style={inputStyle} 
                      value={ind.pct} 
                      onChange={e => {
                        setIndustries(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, pct: e.target.value } : item
                        ));
                      }}
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <div className="w-full md:w-[20%]">
                    <label style={labelStyle}>Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="w-9 h-9 p-0 border-0 rounded cursor-pointer" 
                        value={ind.color} 
                        onChange={e => {
                          setIndustries(prev => prev.map((item, idx) =>
                            idx === i ? { ...item, color: e.target.value } : item
                          ));
                        }} 
                      />
                      <input 
                        style={{...inputStyle, padding: '4px 8px'}} 
                        value={ind.color} 
                        readOnly 
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => setIndustries(industries.filter((_, idx) => idx !== i))} 
                    className="w-9 h-9 flex items-center justify-center shrink-0 bg-[#fef2f2] border border-[#fecaca] text-[#ef4444] rounded-lg mb-0.5"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3 border-t border-[#e8e8e8] pt-5">
              <button onClick={handleSave} style={{ background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Save Form</button>
              {doc && <button onClick={handlePublish} style={{ background: '#111', color: '#fff', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Publish Live</button>}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card style={{ position: 'sticky', top: 20 }}>
            <h3 className="text-[15px] font-bold text-[#111] mb-6 border-b border-[#e8e8e8] pb-3">Live Preview</h3>
            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={industries} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={3} dataKey="value" stroke="none">
                    {industries.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {industries.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}/>
                  <span className="text-[12px] text-[#555]">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminFormLayout>
  );
}