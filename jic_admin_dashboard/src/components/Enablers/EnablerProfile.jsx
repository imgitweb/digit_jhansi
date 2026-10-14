import React, { useState, useEffect } from 'react';
import * as api from '../../api/enablerApi';

export default function EnablerProfile({ enablerId, goBack, onEdit, refreshTick }) {
  const [enabler, setEnabler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('identity'); 

  useEffect(() => {
    const fetchEnabler = async () => {
      setLoading(true);
      try {
        const res = await api.getEnablerById(enablerId);
        if (res.success) {
          setEnabler(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    if (enablerId) fetchEnabler();
  }, [enablerId, refreshTick]);

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

  if (error || !enabler) {
    return (
      <div style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: 16 }}>
        <p style={{ margin: 0, fontSize: 14 }}>{error || 'Enabler not found'}</p>
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
      case 'Verified': return { ...base, background: 'rgba(139,92,246,0.08)', color: '#8b5cf6' };
      default: return { ...base, background: '#f5f5f5', color: '#888888' };
    }
  };

  const tabs = [
    { id: 'identity', name: 'Identity & Location' },
    { id: 'services', name: 'Services & Capabilities' },
    { id: 'business', name: 'Business Details' },
    { id: 'notes', name: 'Notes' }
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
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: 0, lineHeight: 1 }}>{enabler.companyName}</h1>
            <span style={getStatusStyle(enabler.status)}>
              {enabler.status}
            </span>
          </div>
        </div>

        <button 
          onClick={() => onEdit(enabler)} 
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
        
        {/* TAB 1 */}
        {activeTab === 'identity' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Company Info</h3>
              <DetailRow label="Enabler ID" value={enabler.enablerId} />
              <DetailRow label="Company Name" value={enabler.companyName} />
              <DetailRow label="Owner Name" value={enabler.ownerName} />
              <DetailRow label="Contact Number" value={enabler.contactNumber} />
              <DetailRow label="Email" value={enabler.email} />
              <DetailRow label="Status" value={enabler.status} />
              <DetailRow label="Reg. Source" value={enabler.registrationSource} />
              <DetailRow label="Created At" value={new Date(enabler.createdAt).toLocaleDateString()} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Location</h3>
              <DetailRow label="Full Address" value={enabler.address?.fullAddress} />
              <DetailRow label="City" value={enabler.address?.city} />
              <DetailRow label="District" value={enabler.address?.district} />
              <DetailRow label="State" value={enabler.address?.state} />
            </div>
          </div>
        )}

        {/* TAB 2 */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Service Profile</h3>
              <DetailRow label="Category" value={enabler.serviceProfile?.category} />
              <DetailRow label="Services Offered" value={enabler.serviceProfile?.servicesOffered?.join(', ')} />
              <DetailRow label="Years of Experience" value={enabler.serviceProfile?.yearsOfExperience} />
              <DetailRow label="Number of Clients" value={enabler.serviceProfile?.numberOfClients} />
              <DetailRow label="Client Types" value={enabler.serviceProfile?.clientTypes} />
              <DetailRow label="Pricing Model" value={enabler.serviceProfile?.pricingModel} />
              <DetailRow label="Service Area" value={enabler.serviceProfile?.serviceArea} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Capabilities</h3>
              <DetailRow label="Supports Local Biz" value={enabler.capabilities?.supportsLocalBusinesses ? 'Yes' : 'No'} />
              <DetailRow label="Handles Ecom Platforms" value={enabler.capabilities?.handlesEcommercePlatforms ? 'Yes' : 'No'} />
              <DetailRow label="Platforms Supported" value={enabler.capabilities?.platformsSupported?.join(', ')} />
              <DetailRow label="Packaging" value={enabler.capabilities?.providesPackaging ? 'Yes' : 'No'} />
              <DetailRow label="Logistics" value={enabler.capabilities?.providesLogistics ? 'Yes' : 'No'} />
              <DetailRow label="Product Listing" value={enabler.capabilities?.providesProductListing ? 'Yes' : 'No'} />
              <DetailRow label="Photography" value={enabler.capabilities?.providesProductPhotography ? 'Yes' : 'No'} />
              <DetailRow label="Quality Assurance" value={enabler.capabilities?.providesQualityAssurance ? 'Yes' : 'No'} />
              <DetailRow label="Digital Marketing" value={enabler.capabilities?.providesDigitalMarketing ? 'Yes' : 'No'} />
              <DetailRow label="Warehouse" value={enabler.capabilities?.providesWarehouse ? 'Yes' : 'No'} />
            </div>
          </div>
        )}

        {/* TAB 3 */}
        {activeTab === 'business' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Company Scale</h3>
              <DetailRow label="Tech Capability Level" value={enabler.businessDetails?.techCapabilityLevel} />
              <DetailRow label="Team Size" value={enabler.businessDetails?.teamSize} />
              <DetailRow label="Turnover Range" value={enabler.businessDetails?.turnoverRange} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Strengths & Partnerships</h3>
              <DetailRow label="Key Strengths" value={enabler.businessDetails?.keyStrengths?.join(', ')} />
              <DetailRow label="Certifications" value={enabler.businessDetails?.certifications?.join(', ')} />
              <DetailRow label="Partnerships" value={enabler.businessDetails?.partnerships?.join(', ')} />
              <DetailRow label="Willing to Onboard Local Sellers" value={enabler.willingToOnboardLocalSellers ? 'Yes' : 'No'} />
            </div>
          </div>
        )}

        {/* TAB 4 */}
        {activeTab === 'notes' && (
          <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>System & Interaction Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <div>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#555555', marginBottom: 12 }}>Internal Notes</span>
                <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, fontSize: 13, color: '#111111', minHeight: 100, whiteSpace: 'pre-wrap' }}>
                  {enabler.notes || 'No internal notes available.'}
                </div>
              </div>
              <div className="mt-4 md:mt-0 pt-4 md:pt-0">
                <DetailRow label="Registration Source" value={enabler.registrationSource} />
                <DetailRow label="Date Registered" value={new Date(enabler.createdAt).toLocaleDateString()} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}