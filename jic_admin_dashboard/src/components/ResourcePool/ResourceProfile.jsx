import React, { useState, useEffect } from 'react';
import * as api from '../../api/resourceApi';

export default function ResourceProfile({ resourceId, goBack, onEdit, refreshTick }) {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      try {
        const res = await api.getResourceById(resourceId);
        if (res.success) {
          setResource(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    if (resourceId) fetchResource();
  }, [resourceId, refreshTick]);

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

  if (error || !resource) {
    return (
      <div style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: 16 }}>
        <p style={{ margin: 0, fontSize: 14 }}>{error || 'Resource not found'}</p>
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
      case 'Placed': return { ...base, background: 'rgba(59,130,246,0.08)', color: '#3b82f6' };
      case 'Blacklisted': return { ...base, background: 'rgba(239,68,68,0.08)', color: '#ef4444' };
      default: return { ...base, background: '#f5f5f5', color: '#888888' };
    }
  };

  const tabs = [
    { id: 'personal', name: 'Personal & Location' },
    { id: 'professional', name: 'Professional Profile' },
    { id: 'education', name: 'Education & Digital' },
    { id: 'preferences', name: 'Preferences & Notes' }
  ];

  return (
    <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', height: 'calc(100vh - 2rem)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP ACTION BAR */}
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
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: 0, lineHeight: 1 }}>{resource.fullName}</h1>
            <span style={getStatusStyle(resource.status)}>
              {resource.status}
            </span>
          </div>
        </div>

        <button 
          onClick={() => onEdit(resource)} 
          style={{ display: 'flex', alignItems: 'center', background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, padding: '8px 20px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#02b870'} onMouseLeave={e => e.currentTarget.style.background = '#03D985'}
        >
          <svg style={{ width: 16, height: 16, marginRight: 8, opacity: 0.9 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </button>
      </div>

      {/* 2. TAB NAVIGATION */}
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

      {/* 3. TAB CONTENT AREA */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f5f5f5', padding: '24px' }}>
        
        {/* --- TAB 1: Personal & Location --- */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Personal Details</h3>
              <DetailRow label="Resource ID" value={resource.resourceId} />
              <DetailRow label="Phone Number" value={resource.phoneNumber} />
              <DetailRow label="Email Address" value={resource.email} />
              <DetailRow label="Gender" value={resource.gender} />
              <DetailRow label="Age / DOB" value={`${resource.age || '-'} Yrs / ${resource.dateOfBirth ? new Date(resource.dateOfBirth).toLocaleDateString() : '-'}`} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Location & Address</h3>
              <DetailRow label="Full Address" value={resource.address?.fullAddress} />
              <DetailRow label="Village / Ward" value={resource.address?.village} />
              <DetailRow label="Block" value={resource.address?.block} />
              <DetailRow label="District" value={resource.address?.district} />
              <DetailRow label="State" value={resource.address?.state} />
            </div>
          </div>
        )}

        {/* --- TAB 2: Professional Profile --- */}
        {activeTab === 'professional' && (
          <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Professional & Employment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <div>
                <DetailRow label="Primary Skill" value={resource.skills?.primary?.name ? `${resource.skills.primary.name} (${resource.skills.primary.level})` : '-'} />
                <DetailRow label="Secondary Skill" value={resource.skills?.secondary?.name ? `${resource.skills.secondary.name} (${resource.skills.secondary.level})` : '-'} />
                <DetailRow label="Tertiary Skill" value={resource.skills?.tertiary?.name ? `${resource.skills.tertiary.name} (${resource.skills.tertiary.level})` : '-'} />
              </div>
              <div>
                <DetailRow label="Employment Status" value={resource.employment?.currentStatus} />
                <DetailRow label="Current Job Role" value={resource.employment?.jobRole} />
                <DetailRow label="Experience" value={`${resource.employment?.yearsOfExperience || 0} Years`} />
                <DetailRow label="Last Month Salary" value={resource.employment?.lastMonthSalary ? `₹${resource.employment.lastMonthSalary}` : '-'} />
                <DetailRow label="Current/Last Employer" value={resource.employment?.employerName} />
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: Education & Digital --- */}
        {activeTab === 'education' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Educational Qualifications</h3>
              <DetailRow label="Highest Qual." value={resource.education?.highestQualification} />
              <DetailRow label="Degree / Spec." value={resource.education?.degreeName ? `${resource.education.degreeName} (${resource.education.specialization || ''})` : '-'} />
              <DetailRow label="Institution" value={resource.education?.collegeUniversity} />
              <DetailRow label="Passout Year" value={resource.education?.passoutYear} />
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Digital Literacy & Tools</h3>
              <DetailRow label="Digital Literacy" value={resource.digitalProfile?.digitalLiteracyLevel} />
              <DetailRow label="Languages Known" value={resource.digitalProfile?.languagesKnown?.join(', ')} />
              <DetailRow label="Certifications" value={resource.digitalProfile?.certifications?.join(', ')} />
              <DetailRow label="Device Access" value={`Smartphone: ${resource.digitalProfile?.ownsSmartphone ? 'Yes' : 'No'} | Internet: ${resource.digitalProfile?.hasInternetAccess ? 'Yes' : 'No'}`} />
            </div>
          </div>
        )}

        {/* --- TAB 4: Preferences & Notes --- */}
        {activeTab === 'preferences' && (
          <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e8e8e8', paddingBottom: 12, marginBottom: 16 }}>Work Preferences & Internal Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <div>
                <DetailRow label="Areas of Interest" value={resource.interests?.filter(Boolean).join(', ')} />
                <DetailRow label="Preferred Work Type" value={resource.workPreference?.preferredWorkType} />
                <DetailRow label="Expected Salary" value={resource.workPreference?.expectedSalary ? `₹${resource.workPreference.expectedSalary}` : '-'} />
                <DetailRow label="Availability" value={resource.workPreference?.availability} />
              </div>
              <div>
                <DetailRow label="Willing to Relocate" value={resource.flags?.willingToRelocate ? 'Yes' : 'No'} />
                <DetailRow label="Willing for Training" value={resource.flags?.willingForTraining ? 'Yes' : 'No'} />
                
                <div style={{ marginTop: 24 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#888888', marginBottom: 8 }}>System Notes</span>
                  <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, fontSize: 13, color: '#555555', minHeight: 100 }}>
                    {resource.notes || 'No internal notes available for this resource.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}