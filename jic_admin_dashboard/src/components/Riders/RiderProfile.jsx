import React, { useState, useEffect } from 'react';
import * as api from '../../api/riderApi';

export default function RiderProfile({ riderId, goBack, onEdit, refreshTick }) {
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('identity'); 

  useEffect(() => {
    const fetchRider = async () => {
      setLoading(true);
      try {
        const res = await api.getRiderById(riderId);
        if (res.success) {
          setRider(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    if (riderId) fetchRider();
  }, [riderId, refreshTick]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
        <svg style={{ animation: 'spin 1s linear infinite', height: 32, width: 32, color: '#03D985' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error || !rider) {
    return (
      <div style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: 16 }}>
        <p style={{ margin: 0, fontSize: 14 }}>{error || 'Rider not found'}</p>
        <button onClick={goBack} style={{ marginTop: 16, padding: '8px 16px', borderRadius: 8, background: '#ffffff', color: '#555555', border: '1px solid #dddddd', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
          Go Back
        </button>
      </div>
    );
  }

  const DetailRow = ({ label, value }) => (
    <div style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid #f0f0f0', flexDirection: 'row', alignItems: 'center' }}>
      <span style={{ width: '33.33%', fontSize: 13, fontWeight: 600, color: '#888888' }}>{label}</span>
      <span style={{ width: '66.66%', fontSize: 13, fontWeight: 500, color: '#111111', wordBreak: 'break-word' }}>{value || '-'}</span>
    </div>
  );

  const getStatusStyle = (status) => {
    const base = { borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 };
    switch(status) {
      case 'Active': return { ...base, background: 'rgba(3,217,133,0.08)', color: '#16a34a' };
      case 'Inactive': return { ...base, background: '#f5f5f5', color: '#888888' };
      case 'Suspended': return { ...base, background: 'rgba(239,68,68,0.08)', color: '#ef4444' };
      case 'Verified': return { ...base, background: 'rgba(139,92,246,0.08)', color: '#8b5cf6' };
      default: return { ...base, background: '#f5f5f5', color: '#888888' };
    }
  };

  const tabs = [
    { id: 'identity', name: 'Identity & Location' },
    { id: 'work', name: 'Work & Earnings' },
    { id: 'digital', name: 'Digital & Financial' },
    { id: 'notes', name: 'Challenges & Notes' }
  ];

  return (
    <div style={{ 
      background: '#ffffff', 
      border: '1px solid #e8e8e8', 
      borderRadius: 12, 
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)', 
      height: '100%',        
      minHeight: 'calc(100vh - 200px)',
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e8e8e8', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={goBack} 
            style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            <svg style={{ width: 16, height: 16, marginRight: 8, color: 'inherit' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: '1px solid #e8e8e8' }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: 0, lineHeight: 1 }}>{rider.fullName}</h1>
            <span style={getStatusStyle(rider.status)}>
              {rider.status}
            </span>
          </div>
        </div>

        <button 
          onClick={() => onEdit(rider)} 
          style={{ display: 'flex', alignItems: 'center', background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, padding: '8px 20px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#02b870'} onMouseLeave={e => e.currentTarget.style.background = '#03D985'}
        >
          <svg style={{ width: 16, height: 16, marginRight: 8, opacity: 0.9 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </button>
      </div>

      <div style={{ background: '#fafafa', borderBottom: '1px solid #e8e8e8', padding: '0 24px', flexShrink: 0 }}>
        <nav style={{ display: 'flex', overflowX: 'auto', marginBottom: '-1px' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '16px 4px', marginRight: 32, fontSize: 14, fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#03D985' : '#888888', border: 'none', background: 'transparent', cursor: 'pointer',
                  borderBottom: isActive ? '2px solid #03D985' : '2px solid transparent', transition: 'color 0.2s', whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => { if(!isActive) e.currentTarget.style.color = '#111111' }}
                onMouseLeave={e => { if(!isActive) e.currentTarget.style.color = '#888888' }}
              >
                {isActive && <span style={{ width: 6, height: 6, background: '#03D985', borderRadius: '50%', display: 'inline-block', marginRight: 8 }}></span>}
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: '#f5f5f5', padding: '24px' }}>
        
        {activeTab === 'identity' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Identity & Basic Info</h3>
              <DetailRow label="Rider ID" value={rider.riderId} />
              <DetailRow label="Phone Number" value={rider.phoneNumber} />
              <DetailRow label="Gender" value={rider.gender} />
              <DetailRow label="Age" value={rider.age ? `${rider.age} Yrs` : '-'} />
              <DetailRow label="City" value={rider.city} />
              <DetailRow label="Area / Locality" value={rider.areaLocality} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Platform & Vehicle</h3>
              <DetailRow label="Primary Platform" value={rider.platform?.primary} />
              <DetailRow label="Other Platforms" value={rider.platform?.others?.join(', ')} />
              <DetailRow label="Employment Type" value={rider.employment?.type} />
              <DetailRow label="Vehicle Type" value={rider.vehicle?.type} />
              <DetailRow label="Owns Vehicle" value={rider.vehicle?.ownsVehicle ? 'Yes' : 'No'} />
              <DetailRow label="Driving License" value={rider.vehicle?.drivingLicense ? 'Yes' : 'No'} />
              <DetailRow label="Vehicle Details" value={rider.vehicle?.details} />
            </div>
          </div>
        )}

        {activeTab === 'work' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Work Schedule & Experience</h3>
              <DetailRow label="Hours per Day" value={rider.workSchedule?.hoursPerDay} />
              <DetailRow label="Days per Week" value={rider.workSchedule?.daysPerWeek} />
              <DetailRow label="Preferred Shift" value={rider.workSchedule?.preferredShift} />
              <DetailRow label="Years Experience" value={rider.experience?.years !== undefined ? `${rider.experience.years} Yrs` : '-'} />
              <DetailRow label="Order Type" value={rider.experience?.orderType} />
              <DetailRow label="Avg Daily Orders" value={rider.experience?.dailyOrdersAvg} />
              <DetailRow label="Service Area" value={rider.experience?.serviceAreaCovered} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Earnings & Estimates</h3>
              <DetailRow label="Average Monthly" value={rider.earnings?.averageMonthly ? `₹${rider.earnings.averageMonthly}` : '-'} />
              <DetailRow label="Peak Month" value={rider.earnings?.peakMonth} />
              <DetailRow label="Fuel Cost (Monthly)" value={rider.earnings?.fuelCostMonthly ? `₹${rider.earnings.fuelCostMonthly}` : '-'} />
              <DetailRow label="Maintenance (Monthly)" value={rider.earnings?.maintenanceCostMonthly ? `₹${rider.earnings.maintenanceCostMonthly}` : '-'} />
              <DetailRow label="Net Savings Est." value={rider.earnings?.netSavingsEstimate ? `₹${rider.earnings.netSavingsEstimate}` : '-'} />
            </div>
          </div>
        )}

        {activeTab === 'digital' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Digital Profile & Finances</h3>
              <DetailRow label="App Usage Level" value={rider.digital?.appUsageLevel} />
              <DetailRow label="Smartphone Available" value={rider.digital?.smartphoneAvailable ? 'Yes' : 'No'} />
              <DetailRow label="Internet Access" value={rider.digital?.internetAccess ? 'Yes' : 'No'} />
              <DetailRow label="Bank Account" value={rider.financial?.bankAccount ? 'Yes' : 'No'} />
              <DetailRow label="UPI Available" value={rider.financial?.upiAvailable ? 'Yes' : 'No'} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Safety & Growth Potential</h3>
              <DetailRow label="Willing for Local Delivery" value={rider.delivery?.willingForLocal ? 'Yes' : 'No'} />
              <DetailRow label="Willing for E-commerce" value={rider.delivery?.willingForEcommerce ? 'Yes' : 'No'} />
              <DetailRow label="Insurance Cover" value={rider.safety?.insuranceCover ? 'Yes' : 'No'} />
              <DetailRow label="Accident History" value={rider.safety?.accidentHistory ? 'Yes' : 'No'} />
              <DetailRow label="Interest in Full-time Job" value={rider.growth?.interestInFulltimeJob ? 'Yes' : 'No'} />
              <DetailRow label="Interest in Skill Training" value={rider.growth?.interestInSkillTraining ? 'Yes' : 'No'} />
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Challenges & Internal Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <div>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#555555', marginBottom: 12 }}>Challenges Faced</span>
                <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, fontSize: 13, color: '#111111', minHeight: 100, whiteSpace: 'pre-wrap' }}>
                  {rider.challengesFaced || 'No challenges faced recorded.'}
                </div>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e8e8e8' }}>
                  <DetailRow label="Registration Source" value={rider.registrationSource} />
                  <DetailRow label="Date Registered" value={new Date(rider.createdAt).toLocaleDateString()} />
                </div>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#555555', marginBottom: 12 }}>System Notes</span>
                <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, fontSize: 13, color: '#111111', minHeight: 100, whiteSpace: 'pre-wrap' }}>
                  {rider.notes || 'No internal notes available for this rider.'}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}