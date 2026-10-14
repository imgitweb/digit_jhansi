import React, { useState, useEffect } from 'react';
import * as api from '../../api/riderApi';
import Transition from '../../utils/Transition';
import { useAppToast } from '../../hooks/useAppToast';

const emptyForm = {
  fullName:'', phoneNumber:'', gender:'', age:'', city:'', areaLocality:'', status:'Active', notes:'', challengesFaced:'',
  platform: { primary:'', others:'' },
  employment: { type:'' },
  vehicle: { type:'', ownsVehicle:false, details:'', drivingLicense:false },
  workSchedule: { hoursPerDay:'', daysPerWeek:'', preferredShift:'' },
  earnings: { averageMonthly:'', peakMonth:'', fuelCostMonthly:'', maintenanceCostMonthly:'', netSavingsEstimate:'' },
  experience: { years:'', orderType:'', dailyOrdersAvg:'', serviceAreaCovered:'' },
  delivery: { willingForLocal:false, willingForEcommerce:false },
  digital: { smartphoneAvailable:false, internetAccess:false, appUsageLevel:'' },
  financial: { bankAccount:false, upiAvailable:false },
  safety: { insuranceCover:false, accidentHistory:false },
  growth: { interestInFulltimeJob:false, interestInSkillTraining:false }
};

export default function RiderFormModal({ isOpen, onClose, rider, refreshData }) {
  const toast = useAppToast();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (rider) {
      setFormData({
        ...emptyForm, ...rider,
        platform: { ...emptyForm.platform, ...rider.platform, others: rider.platform?.others ? rider.platform.others.join(', ') : '' },
        employment: { ...emptyForm.employment, ...rider.employment },
        vehicle: { ...emptyForm.vehicle, ...rider.vehicle },
        workSchedule: { ...emptyForm.workSchedule, ...rider.workSchedule },
        earnings: { ...emptyForm.earnings, ...rider.earnings },
        experience: { ...emptyForm.experience, ...rider.experience },
        delivery: { ...emptyForm.delivery, ...rider.delivery },
        digital: { ...emptyForm.digital, ...rider.digital },
        financial: { ...emptyForm.financial, ...rider.financial },
        safety: { ...emptyForm.safety, ...rider.safety },
        growth: { ...emptyForm.growth, ...rider.growth }
      });
    } else {
      setFormData(emptyForm);
    }
  }, [rider]);

  const handleTopLevel = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNested = (section, field, value) => setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const payload = JSON.parse(JSON.stringify(formData));
    payload.age = payload.age === '' ? null : Number(payload.age);
    ['hoursPerDay', 'daysPerWeek'].forEach(k => { if(payload.workSchedule[k]) payload.workSchedule[k] = Number(payload.workSchedule[k]); });
    ['averageMonthly', 'fuelCostMonthly', 'maintenanceCostMonthly', 'netSavingsEstimate'].forEach(k => { if(payload.earnings[k]) payload.earnings[k] = Number(payload.earnings[k]); });
    ['years', 'dailyOrdersAvg'].forEach(k => { if(payload.experience[k]) payload.experience[k] = Number(payload.experience[k]); });
    
    if (!rider?._id) payload.riderId = `RDR-MANUAL-${Date.now()}`;

    payload.platform.others = typeof payload.platform.others === 'string' 
      ? payload.platform.others.split(',').map(s => s.trim()).filter(Boolean)
      : payload.platform.others;

    try {
      if (rider?._id) {
        await api.updateRider(rider._id, payload);
        toast.success('Rider updated successfully');
      } else {
        await api.createRider(payload);
        toast.success('Rider added successfully');
      }
      refreshData();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save rider. Check network and required fields.');
      toast.error(err.response?.data?.message || 'Failed to save rider');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { border: '1px solid #dddddd', borderRadius: 8, background: '#ffffff', color: '#333333', padding: '8px 12px', fontSize: 13, outline: 'none', width: '100%', transition: 'border-color 0.2s' };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#555555', marginBottom: 4, display: 'block' };
  const headingStyle = { fontSize: 13, fontWeight: 700, color: '#111111', borderBottom: '1px solid #e8e8e8', paddingBottom: 8, marginTop: 8, marginBottom: 16 };

  return (
    <>
      <Transition
        unmountOnExit={true}
        className="fixed inset-0 z-[100] transition-opacity"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        show={isOpen}
        enter="transition ease-out duration-200" enterStart="opacity-0" enterEnd="opacity-100"
        leave="transition ease-out duration-100" leaveStart="opacity-100" leaveEnd="opacity-0"
        aria-hidden="true"
      />
      <Transition
        unmountOnExit={true}
        className="fixed inset-0 z-[101] overflow-hidden flex items-center justify-center px-4 sm:px-6"
        role="dialog" aria-modal="true"
        show={isOpen}
        enter="transition ease-in-out duration-200" enterStart="opacity-0 translate-y-4 scale-95" enterEnd="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in-out duration-200" leaveStart="opacity-100 translate-y-0 scale-100" leaveEnd="opacity-0 translate-y-4 scale-95"
      >
        <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,0.15)', width: '100%', maxWidth: 896, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ borderBottom: '1px solid #e8e8e8', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: 0 }}>{rider ? 'Edit Rider' : 'Add New Rider'}</h2>
            <button type="button" onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f5f5', color: '#888888', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#eeeeee'} onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>
              &times;
            </button>
          </div>
          
          <form id="rider-form" onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {error && <div style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: 12, fontSize: 14 }}>{error}</div>}
            
            <div>
              <h3 style={headingStyle}>Basic Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleTopLevel} style={inputStyle} pattern="[0-9]{10}" placeholder="10 digits" onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select name="status" value={formData.status} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div className="md:col-span-4">
                  <label style={labelStyle}>Area/Locality</label>
                  <input type="text" name="areaLocality" value={formData.areaLocality} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Platform & Employment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label style={labelStyle}>Primary Platform</label>
                  <input type="text" value={formData.platform.primary} onChange={(e) => handleNested('platform', 'primary', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Employment Type</label>
                  <select value={formData.employment.type} onChange={(e) => handleNested('employment', 'type', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Freelance">Freelance</option><option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label style={labelStyle}>Other Platforms (comma-separated)</label>
                  <input type="text" value={formData.platform.others} onChange={(e) => handleNested('platform', 'others', e.target.value)} style={inputStyle} placeholder="e.g. Zomato, Swiggy, Rapido" onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label style={labelStyle}>Vehicle Type</label>
                  <select value={formData.vehicle.type} onChange={(e) => handleNested('vehicle', 'type', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="Bicycle">Bicycle</option><option value="Motorcycle">Motorcycle</option><option value="Auto">Auto</option><option value="Car">Car</option><option value="Van">Van</option><option value="Truck">Truck</option><option value="E-Bike">E-Bike</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Vehicle Details (Make/Model/Year)</label>
                  <input type="text" value={formData.vehicle.details} onChange={(e) => handleNested('vehicle', 'details', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-3 flex space-x-6 pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.vehicle.ownsVehicle} onChange={(e) => handleNested('vehicle', 'ownsVehicle', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Owns Vehicle</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.vehicle.drivingLicense} onChange={(e) => handleNested('vehicle', 'drivingLicense', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Has Driving License</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Work Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label style={labelStyle}>Hours Per Day</label>
                  <input type="number" value={formData.workSchedule.hoursPerDay} onChange={(e) => handleNested('workSchedule', 'hoursPerDay', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Days Per Week</label>
                  <input type="number" value={formData.workSchedule.daysPerWeek} onChange={(e) => handleNested('workSchedule', 'daysPerWeek', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Preferred Shift</label>
                  <input type="text" value={formData.workSchedule.preferredShift} onChange={(e) => handleNested('workSchedule', 'preferredShift', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Earnings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label style={labelStyle}>Avg Monthly Earnings</label>
                  <input type="number" value={formData.earnings.averageMonthly} onChange={(e) => handleNested('earnings', 'averageMonthly', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Peak Earnings Month</label>
                  <input type="text" value={formData.earnings.peakMonth} onChange={(e) => handleNested('earnings', 'peakMonth', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Net Savings Est.</label>
                  <input type="number" value={formData.earnings.netSavingsEstimate} onChange={(e) => handleNested('earnings', 'netSavingsEstimate', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Fuel Cost / Month</label>
                  <input type="number" value={formData.earnings.fuelCostMonthly} onChange={(e) => handleNested('earnings', 'fuelCostMonthly', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Maintenance / Month</label>
                  <input type="number" value={formData.earnings.maintenanceCostMonthly} onChange={(e) => handleNested('earnings', 'maintenanceCostMonthly', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Experience & Delivery</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label style={labelStyle}>Years of Exp</label>
                  <input type="number" value={formData.experience.years} onChange={(e) => handleNested('experience', 'years', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Order Type</label>
                  <input type="text" value={formData.experience.orderType} onChange={(e) => handleNested('experience', 'orderType', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Daily Orders Avg</label>
                  <input type="number" value={formData.experience.dailyOrdersAvg} onChange={(e) => handleNested('experience', 'dailyOrdersAvg', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Service Area</label>
                  <input type="text" value={formData.experience.serviceAreaCovered} onChange={(e) => handleNested('experience', 'serviceAreaCovered', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-4 flex space-x-6 pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.delivery.willingForLocal} onChange={(e) => handleNested('delivery', 'willingForLocal', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Willing for Local Delivery</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.delivery.willingForEcommerce} onChange={(e) => handleNested('delivery', 'willingForEcommerce', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Willing for E-commerce</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Digital & Financial</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label style={labelStyle}>App Usage Level</label>
                  <select value={formData.digital.appUsageLevel} onChange={(e) => handleNested('digital', 'appUsageLevel', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="None">None</option><option value="Basic">Basic</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex flex-wrap gap-x-6 gap-y-3 pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.digital.smartphoneAvailable} onChange={(e) => handleNested('digital', 'smartphoneAvailable', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Smartphone Available</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.digital.internetAccess} onChange={(e) => handleNested('digital', 'internetAccess', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Internet Access</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.financial.bankAccount} onChange={(e) => handleNested('financial', 'bankAccount', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Bank Account</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.financial.upiAvailable} onChange={(e) => handleNested('financial', 'upiAvailable', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>UPI Available</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Safety & Growth</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.safety.insuranceCover} onChange={(e) => handleNested('safety', 'insuranceCover', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                  <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Insurance Cover</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.safety.accidentHistory} onChange={(e) => handleNested('safety', 'accidentHistory', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                  <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Accident History</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.growth.interestInFulltimeJob} onChange={(e) => handleNested('growth', 'interestInFulltimeJob', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                  <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Interest in Fulltime Job</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.growth.interestInSkillTraining} onChange={(e) => handleNested('growth', 'interestInSkillTraining', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                  <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Interest in Skill Training</span>
                </label>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Notes</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label style={labelStyle}>Challenges Faced</label>
                  <textarea name="challengesFaced" value={formData.challengesFaced} onChange={handleTopLevel} rows="2" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}></textarea>
                </div>
                <div>
                  <label style={labelStyle}>System Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleTopLevel} rows="3" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}></textarea>
                </div>
              </div>
            </div>
          </form>

          <div style={{ background: '#fafafa', borderTop: '1px solid #e8e8e8', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>Cancel</button>
            <button type="submit" form="rider-form" disabled={loading} style={{ background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, border: 'none', padding: '8px 16px', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, transition: 'background 0.2s' }} onMouseEnter={e => { if(!loading) e.currentTarget.style.background = '#02b870' }} onMouseLeave={e => { if(!loading) e.currentTarget.style.background = '#03D985' }}>
              {loading ? 'Saving...' : 'Save Rider'}
            </button>
          </div>
        </div>
      </Transition>
    </>
  );
}