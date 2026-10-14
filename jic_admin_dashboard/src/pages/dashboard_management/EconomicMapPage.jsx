import React, { useState, useEffect } from 'react';
import { useAppToast } from '../../hooks/useAppToast';
import { economicMapApi } from '../../api/dashboardApi';
import AdminFormLayout, { inputStyle, labelStyle } from './AdminFormLayout';
import Card from '../../components/ui/Card';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow });

const CAT_COLORS = { 'Industrial Cluster': '#3b82f6', 'Mining Area': '#f59e0b', 'MSME Unit': '#03D985', 'Education Institute': '#8b5cf6', 'Skill Center': '#06b6d4', 'Warehouse': '#ec4899', 'High Unemployment Zone': '#ef4444' };

export default function EconomicMapPage() {   
  const [period, setPeriod] = useState("This Year (2024-25)");
  const [doc, setDoc] = useState(null);
  const [points, setPoints] = useState([]);
  const toast = useAppToast();     

  const fetchDoc = async () => {
    try {
      const pMap = { 'This Year (2024-25)': 'this_year', 'Last Year (2023-24)': 'last_year', 'Last 2 Years': 'last_2_years', 'Last 5 Years': 'last_5_years', 'Custom Range': 'custom' };
      const match = (await economicMapApi.getAll()).find(d => d.period === pMap[period]);
      if(match) { setDoc(match); setPoints(match.points); } else { setDoc(null); setPoints([]); }
    } catch (err) { toast.error("Fetch failed"); }
  };

  useEffect(() => { fetchDoc(); }, [period]);

  const handleSave = async () => {
    try {
      const payload = { period: period === 'This Year (2024-25)' ? 'this_year' : 'last_year', fiscalYear: '2024-25', points };
      if(doc) { await economicMapApi.update(doc._id, payload); toast.success("Updated successfully"); }
      else { await economicMapApi.create(payload); toast.success("Created draft"); fetchDoc(); }
    } catch (err) { toast.error("Save failed"); }
  };
  const handlePublish = async () => { if(doc) { await economicMapApi.publish(doc._id); toast.success("Live!"); fetchDoc(); } };

  return (
    <AdminFormLayout title="Economic Map" description="Manage Leaflet Map Coordinate Points" selectedPeriod={period} setSelectedPeriod={setPeriod}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-6"><h3 className="text-[15px] font-bold text-[#111]">Points Array</h3><button onClick={() => setPoints([...points, { label:'', lat:24.5700, lng:80.8322, category:'Industrial Cluster', color:'#3b82f6', description:'', displayOrder: points.length + 1 }])} style={{ background: '#f5f5f5', border: '1px solid #e8e8e8', color: '#555', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>+ Add Point</button></div>
          <div className="flex flex-col gap-4">
            {points.map((pt, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 bg-[#f9fafb] border border-[#f0f0f0] rounded-lg">
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1"><label style={labelStyle}>Label</label><input style={inputStyle} value={pt.label} onChange={e => { const n = [...points]; n[i].label = e.target.value; setPoints(n); }} /></div>
                  <div className="w-[30%]">
                    <label style={labelStyle}>Category</label>
                    <select style={inputStyle} value={pt.category} onChange={e => { const n = [...points]; n[i].category = e.target.value; n[i].color = CAT_COLORS[e.target.value]; setPoints(n); }}>
                      {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="w-[15%]"><label style={labelStyle}>Color</label><div className="h-[34px] rounded border border-[#ddd] flex items-center justify-center bg-white"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: pt.color }}></div></div></div>
                  <button onClick={() => setPoints(points.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center shrink-0 bg-[#fef2f2] text-[#ef4444] rounded-lg mb-0.5">✕</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="w-[20%]"><label style={labelStyle}>Lat</label><input type="number" step="0.0001" style={inputStyle} value={pt.lat} onChange={e => { const n = [...points]; n[i].lat = Number(e.target.value); setPoints(n); }} /></div>
                  <div className="w-[20%]"><label style={labelStyle}>Lng</label><input type="number" step="0.0001" style={inputStyle} value={pt.lng} onChange={e => { const n = [...points]; n[i].lng = Number(e.target.value); setPoints(n); }} /></div>
                  <div className="flex-1"><label style={labelStyle}>Description (Optional)</label><input style={inputStyle} value={pt.description} onChange={e => { const n = [...points]; n[i].description = e.target.value; setPoints(n); }} /></div>
                  <div className="w-[15%]"><label style={labelStyle}>Order</label><input type="number" style={inputStyle} value={pt.displayOrder} onChange={e => { const n = [...points]; n[i].displayOrder = Number(e.target.value); setPoints(n); }} /></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3 border-t border-[#e8e8e8] pt-5">
            <button onClick={handleSave} style={{ background: '#03D985', color: '#000', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Save Form</button>
            {doc && <button onClick={handlePublish} style={{ background: '#111', color: '#fff', fontWeight: 700, borderRadius: 8, padding: '8px 24px' }}>Publish Live</button>}
          </div>
        </Card>
        <Card style={{ position: 'sticky', top: 20 }}>
          <h3 className="text-[15px] font-bold text-[#111] mb-6 border-b border-[#e8e8e8] pb-3">Live Map Preview</h3>
          <div className="w-full relative bg-[#f9fafb] rounded-lg border border-[#f0f0f0] overflow-hidden">
            <MapContainer center={[24.5700, 80.8322]} zoom={10} style={{ height: '400px', width: '100%', borderRadius: '8px', zIndex: 0 }} scrollWheelZoom={false}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {points.map((point, idx) => (
                <CircleMarker key={`map-point-${idx}`} center={[point.lat, point.lng]} radius={8} pathOptions={{ color: point.color, fillColor: point.color, fillOpacity: 0.85, weight: 2 }}>
                  <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111' }}>{point.label}</span><br />
                    <span style={{ fontSize: 11, color: '#888' }}>{point.category}</span>
                  </LeafletTooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </Card>
      </div>
    </AdminFormLayout>
  );
}