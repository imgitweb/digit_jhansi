import React, { useState, useEffect } from 'react';
import * as api from '../../api/industry50LPlusApi';

export default function Industry50LProfile({ industryId, goBack, onEdit, refreshTick }) {
  const [industry, setIndustry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('identity'); 

  useEffect(() => {
    const fetchIndustry = async () => {
      setLoading(true);
      try {
        const res = await api.getIndustry50LById(industryId);
        if (res.success) {
          setIndustry(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    if (industryId) fetchIndustry();
  }, [industryId, refreshTick]);

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

  if (error || !industry) {
    return (
      <div style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: 16 }}>
        <p style={{ margin: 0, fontSize: 14 }}>{error || 'Industry not found'}</p>
        <button onClick={goBack} style={{ marginTop: 16, padding: '8px 16px', borderRadius: 8, background: '#ffffff', color: '#555555', border: '1px solid #dddddd', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
          Go Back
        </button>
      </div>
    );
  }

  const DetailRow = ({ label, value }) => (
    <div style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid #f0f0f0', flexDirection: 'row', alignItems: 'center' }}>
      <span style={{ width: '33.33%', fontSize: 13, fontWeight: 600, color: '#888888' }}>{label}</span>
      <span style={{ width: '66.66%', fontSize: 13, fontWeight: 500, color: '#111111', wordBreak: 'break-word' }}>{value === undefined || value === null || value === '' ? '-' : value}</span>
    </div>
  );

  const getStatusStyle = (status) => {
    const base = { borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 };
    switch(status) {
      case 'Active': return { ...base, background: 'rgba(3,217,133,0.08)', color: '#16a34a' };
      case 'Inactive': return { ...base, background: '#f5f5f5', color: '#888888' };
      case 'Verified': return { ...base, background: 'rgba(139,92,246,0.08)', color: '#8b5cf6' };
      case 'Suspended': return { ...base, background: 'rgba(239,68,68,0.08)', color: '#ef4444' };
      case 'Blacklisted': return { ...base, background: 'rgba(239,68,68,0.08)', color: '#ef4444' };
      default: return { ...base, background: '#f5f5f5', color: '#888888' };
    }
  };

  const tabs = [
    { id: 'identity', name: 'Identity & Location' },
    { id: 'business', name: 'Business & Compliance' },
    { id: 'export', name: 'Export & Digital' },
    { id: 'needs', name: 'Needs & Notes' }
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
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: 0, lineHeight: 1 }}>{industry.companyName}</h1>
            <span style={getStatusStyle(industry.status)}>
              {industry.status}
            </span>
          </div>
        </div>

        <button 
          onClick={() => onEdit(industry)} 
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Company Info</h3>
              <DetailRow label="Industry ID" value={industry.industryId} />
              <DetailRow label="Company Name" value={industry.companyName} />
              <DetailRow label="Owner/CEO Name" value={industry.ownerCeoName} />
              <DetailRow label="Phone Number" value={industry.phoneNumber} />
              <DetailRow label="Email" value={industry.email} />
              <DetailRow label="Website URL" value={industry.websiteUrl ? <a href={industry.websiteUrl.startsWith('http') ? industry.websiteUrl : `https://${industry.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#03D985] hover:underline">{industry.websiteUrl}</a> : '-'} />
              <DetailRow label="Business Category" value={industry.businessCategory} />
              <DetailRow label="Industry Type" value={industry.industryType} />
              <DetailRow label="Nature of Business" value={industry.natureOfBusiness} />
              <DetailRow label="Year Established" value={industry.yearEstablished} />
              <DetailRow label="Company Profile" value={industry.shortCompanyProfile} />
              <DetailRow label="Status" value={industry.status} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Location</h3>
              <DetailRow label="Full Address" value={industry.address?.fullAddress} />
              <DetailRow label="City" value={industry.address?.city} />
              <DetailRow label="District" value={industry.address?.district} />
              <DetailRow label="State" value={industry.address?.state} />
            </div>
          </div>
        )}

        {/* TAB 2 */}
        {activeTab === 'business' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Compliance & Scale</h3>
              <DetailRow label="MSME Registered" value={industry.compliance?.msmeRegistered ? 'Yes' : 'No'} />
              <DetailRow label="GST Registered" value={industry.compliance?.gstRegistered ? 'Yes' : 'No'} />
              <DetailRow label="Company Reg. Type" value={industry.compliance?.companyRegistrationType} />
              <DetailRow label="Certifications" value={industry.compliance?.certifications?.join(', ')} />
              <DetailRow label="Last Year Turnover" value={industry.scale?.lastYearTurnover !== undefined ? `₹${industry.scale.lastYearTurnover}` : '-'} />
              <DetailRow label="Number of Employees" value={industry.scale?.numberOfEmployees} />
              <DetailRow label="Supply Capacity" value={industry.scale?.supplyCapacity} />
              <DetailRow label="Investment Requirement" value={industry.scale?.investmentRequirement !== undefined ? `₹${industry.scale.investmentRequirement}` : '-'} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Products & Market</h3>
              <DetailRow label="Key Products/Services" value={industry.products?.keyProductsServices} />
              <DetailRow label="Major Clients" value={industry.products?.majorClients} />
              <DetailRow label="Operational Area" value={industry.products?.operationalArea} />
              <DetailRow label="Logistics Partners" value={industry.products?.logisticsPartners?.join(', ')} />
            </div>
          </div>
        )}

        {/* TAB 3 */}
        {activeTab === 'export' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Export Details</h3>
              <DetailRow label="Currently Exports" value={industry.export?.exportsCurrently ? 'Yes' : 'No'} />
              <DetailRow label="Export Countries" value={industry.export?.exportCountries?.join(', ')} />
              <DetailRow label="Export Revenue %" value={industry.export?.exportRevenuePercentage !== undefined ? `${industry.export.exportRevenuePercentage}%` : '-'} />
              <DetailRow label="Willing to Export" value={industry.export?.willingToExport ? 'Yes' : 'No'} />
              <DetailRow label="Export Readiness Level" value={industry.export?.exportReadinessLevel} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Digital & Technology</h3>
              <DetailRow label="Technology Usage Level" value={industry.digital?.technologyUsageLevel} />
              <DetailRow label="Digital Presence Level" value={industry.digital?.digitalPresenceLevel} />
              <DetailRow label="Ecommerce Enabled" value={industry.digital?.ecommerceEnabled ? 'Yes' : 'No'} />
            </div>
          </div>
        )}

        {/* TAB 4 */}
        {activeTab === 'needs' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Business Needs</h3>
              <DetailRow label="Hiring Needs" value={industry.needs?.hiringNeeds} />
              <DetailRow label="Skill Gaps" value={industry.needs?.skillGaps} />
              <DetailRow label="Key Challenges" value={industry.needs?.keyChallenges} />
              <DetailRow label="Expansion Plans" value={industry.needs?.expansionPlans} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>System & Interaction Notes</h3>
              <div>
                <span className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">Internal Notes</span>
                <div className="p-4 bg-gray-50/80 dark:bg-[#1B2432] rounded-lg text-sm text-gray-800 dark:text-gray-300 border border-gray-100 dark:border-gray-700/80 min-h-[100px] shadow-inner whitespace-pre-wrap">
                  {industry.notes || 'No internal notes available.'}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <DetailRow label="Registration Source" value={industry.registrationSource} />
                <DetailRow label="Date Registered" value={new Date(industry.createdAt).toLocaleDateString()} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}