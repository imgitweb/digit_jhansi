import React, { useState, useEffect } from 'react';
import { useAppToast } from '../../hooks/useAppToast';
import { exportAnalyticsApi } from '../../api/dashboardApi';
import AdminFormLayout, { inputStyle, labelStyle } from './AdminFormLayout';
import Card from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ExportAnalyticsPage() {
  const [period, setPeriod] = useState("This Year (2024-25)");
  const [doc, setDoc] = useState(null);
  const [stats, setStats] = useState({ totalExport: 0, exportingUnits: 0, countriesExported: 0 });
  const [products, setProducts] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const toast = useAppToast();

  const fetchDoc = async () => {      
    try {
      const pMap = { 'This Year (2024-25)': 'this_year', 'Last Year (2023-24)': 'last_year', 'Last 2 Years': 'last_2_years', 'Last 5 Years': 'last_5_years', 'Custom Range': 'custom' };
      const match = (await exportAnalyticsApi.getAll()).find(d => d.period === pMap[period]);
      if(match) { 
        setDoc(match); setProducts(match.products); setDestinations(match.destinations);
        setStats({ totalExport: match.totalExport, exportingUnits: match.exportingUnits, countriesExported: match.countriesExported });
      } else { setDoc(null); setProducts([]); setDestinations([]); setStats({ totalExport: 0, exportingUnits: 0, countriesExported: 0 }); }
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
        ...stats,
        products,
        destinations,
      };
      if(doc) { await exportAnalyticsApi.update(doc._id, payload); toast.success("Updated successfully"); }
      else { await exportAnalyticsApi.create(payload); toast.success("Created draft"); fetchDoc(); }
    } catch (err) { toast.error("Save failed"); }
  };
  const handlePublish = async () => { if(doc) { await exportAnalyticsApi.publish(doc._id); toast.success("Live!"); fetchDoc(); } };

  return (
    <AdminFormLayout title="Export Analytics" description="Manage Export Products & Destinations" selectedPeriod={period} setSelectedPeriod={setPeriod}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Card>
            <h3 className="text-[15px] font-bold text-[#111] mb-4">Summary Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label style={labelStyle}>Total Export (Cr)</label>
                <input 
                  type="number" 
                  style={inputStyle} 
                  value={stats.totalExport} 
                  onChange={e => setStats({...stats, totalExport: Number(e.target.value)})} 
                  onFocus={e => e.target.style.borderColor = '#03D985'}
                  onBlur={e => e.target.style.borderColor = '#dddddd'}
                />
              </div>
              <div>
                <label style={labelStyle}>Exporting Units</label>
                <input 
                  type="number" 
                  style={inputStyle} 
                  value={stats.exportingUnits} 
                  onChange={e => setStats({...stats, exportingUnits: Number(e.target.value)})} 
                  onFocus={e => e.target.style.borderColor = '#03D985'}
                  onBlur={e => e.target.style.borderColor = '#dddddd'}
                />
              </div>
              <div>
                <label style={labelStyle}>Countries Exported</label>
                <input 
                  type="number" 
                  style={inputStyle} 
                  value={stats.countriesExported} 
                  onChange={e => setStats({...stats, countriesExported: Number(e.target.value)})} 
                  onFocus={e => e.target.style.borderColor = '#03D985'}
                  onBlur={e => e.target.style.borderColor = '#dddddd'}
                />
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[15px] font-bold text-[#111]">Products</h3>
              <button onClick={() => setProducts([...products, { product:'', value:0, pct:'0%', displayOrder: products.length + 1 }])} style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#555', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>+ Add Product</button>
            </div>
            <div className="flex flex-col gap-4">
              {products.map((p, i) => (
                <div key={i} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-4 bg-[#f9fafb] border border-[#f0f0f0] rounded-lg">
                  <div className="w-full md:w-[30%]">
                    <label style={labelStyle}>Product</label>
                    <input 
                      style={inputStyle} 
                      value={p.product} 
                      onChange={e => {
                        const val = e.target.value;
                        setProducts(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, product: val } : item
                        ));
                      }} 
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <div className="w-full md:w-[25%]">
                    <label style={labelStyle}>Value (Cr)</label>
                    <input 
                      type="number" 
                      style={inputStyle} 
                      value={p.value} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        setProducts(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, value: val } : item
                        ));
                      }} 
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <div className="w-full md:w-[25%]">
                    <label style={labelStyle}>Pct (%)</label>
                    <input 
                      style={inputStyle} 
                      value={p.pct} 
                      onChange={e => {
                        const val = e.target.value;
                        setProducts(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, pct: val } : item
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
                      value={p.displayOrder} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        setProducts(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, displayOrder: val } : item
                        ));
                      }} 
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <button onClick={() => setProducts(products.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center shrink-0 bg-[#fef2f2] text-[#ef4444] rounded-lg mb-0.5">✕</button>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[15px] font-bold text-[#111]">Destinations</h3>
              <button onClick={() => setDestinations([...destinations, { country:'', flag:'🌐', pct:0, displayOrder: destinations.length + 1 }])} style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#555', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>+ Add Dest</button>
            </div>
            <div className="flex flex-col gap-4">
              {destinations.map((d, i) => (
                <div key={i} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-4 bg-[#f9fafb] border border-[#f0f0f0] rounded-lg">
                  <div className="w-full md:w-[30%]">
                    <label style={labelStyle}>Country</label>
                    <input 
                      style={inputStyle} 
                      value={d.country} 
                      onChange={e => {
                        const val = e.target.value;
                        setDestinations(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, country: val } : item
                        ));
                      }} 
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <div className="w-full md:w-[25%]">
                    <label style={labelStyle}>Flag Emoji</label>
                    <input 
                      style={inputStyle} 
                      value={d.flag} 
                      onChange={e => {
                        const val = e.target.value;
                        setDestinations(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, flag: val } : item
                        ));
                      }} 
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <div className="w-full md:w-[25%]">
                    <label style={labelStyle}>Pct (0-100)</label>
                    <input 
                      type="number" 
                      style={inputStyle} 
                      value={d.pct} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        setDestinations(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, pct: val } : item
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
                      value={d.displayOrder} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        setDestinations(prev => prev.map((item, idx) =>
                          idx === i ? { ...item, displayOrder: val } : item
                        ));
                      }} 
                      onFocus={e => e.target.style.borderColor = '#03D985'}
                      onBlur={e => e.target.style.borderColor = '#dddddd'}
                    />
                  </div>
                  <button onClick={() => setDestinations(destinations.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center shrink-0 bg-[#fef2f2] text-[#ef4444] rounded-lg mb-0.5">✕</button>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-3 border-t border-[#e8e8e8] pt-5">
              <button onClick={handleSave} style={{ background: '#03D985', color: '#000', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Save Form</button>
              {doc && <button onClick={handlePublish} style={{ background: '#111', color: '#fff', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Publish Live</button>}
            </div>
          </Card>
        </div>

        <Card style={{ position: 'sticky', top: 20 }}>
          <h3 className="text-[15px] font-bold text-[#111] mb-6 border-b border-[#e8e8e8] pb-3">Live Preview</h3>
          <div className="flex flex-col sm:flex-row gap-6 mb-4">
            <div className="w-full sm:w-1/2">
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={products} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="product" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#555' }} width={80} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: 8, border: 'none' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0,3,3,0]} barSize={12}>
                      {products.map((entry, index) => <Cell key={`cell-${index}`} fill="#3b82f6" />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="w-full sm:w-1/2 flex flex-col justify-center gap-3">
              {destinations.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-lg">{item.flag}</span>
                  <span className="text-[12px] text-[#555] w-20 truncate">{item.country}</span>
                  <div className="flex-1 h-[6px] bg-[#f0f0f0] rounded-full mx-2"><div className="h-full bg-[#03D985] rounded-full" style={{ width: `${item.pct}%` }}></div></div>
                  <span className="text-[12px] font-bold text-[#111]">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AdminFormLayout>
  );
}