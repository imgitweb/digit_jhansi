import React, { useState, useEffect } from 'react';
import * as api from '../../api/enablerApi';
import Transition from '../../utils/Transition';
import { useAppToast } from '../../hooks/useAppToast';

const emptyForm = {
  companyName: '', ownerName: '', contactNumber: '', email: '', status: 'Active', notes: '',
  address: { fullAddress: '', city: '', district: '', state: '' },
  serviceProfile: { category: '', servicesOffered: '', yearsOfExperience: '', numberOfClients: '', clientTypes: '', pricingModel: '', serviceArea: '' },
  capabilities: {
    supportsLocalBusinesses: false, handlesEcommercePlatforms: false, platformsSupported: '',
    providesPackaging: false, providesLogistics: false, providesProductListing: false,
    providesProductPhotography: false, providesQualityAssurance: false,
    providesDigitalMarketing: false, providesWarehouse: false
  },
  businessDetails: { techCapabilityLevel: '', teamSize: '', turnoverRange: '', keyStrengths: '', certifications: '', partnerships: '' },
  willingToOnboardLocalSellers: false
};

export default function EnablerFormModal({ isOpen, onClose, enabler, refreshData }) {
  const toast = useAppToast();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (enabler) {
      setFormData({
        ...emptyForm, ...enabler,
        address: { ...emptyForm.address, ...enabler.address },
        serviceProfile: { 
          ...emptyForm.serviceProfile, ...enabler.serviceProfile, 
          servicesOffered: enabler.serviceProfile?.servicesOffered ? enabler.serviceProfile.servicesOffered.join(', ') : '' 
        },
        capabilities: { 
          ...emptyForm.capabilities, ...enabler.capabilities, 
          platformsSupported: enabler.capabilities?.platformsSupported ? enabler.capabilities.platformsSupported.join(', ') : '' 
        },
        businessDetails: { 
          ...emptyForm.businessDetails, ...enabler.businessDetails, 
          keyStrengths: enabler.businessDetails?.keyStrengths ? enabler.businessDetails.keyStrengths.join(', ') : '',
          certifications: enabler.businessDetails?.certifications ? enabler.businessDetails.certifications.join(', ') : '',
          partnerships: enabler.businessDetails?.partnerships ? enabler.businessDetails.partnerships.join(', ') : ''
        }
      });
    } else {
      setFormData(emptyForm);
    }
  }, [enabler]);

  const handleTopLevel = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleNested = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const payload = JSON.parse(JSON.stringify(formData));
    
    // Cast numbers
    if (payload.serviceProfile.yearsOfExperience) payload.serviceProfile.yearsOfExperience = Number(payload.serviceProfile.yearsOfExperience);
    if (payload.serviceProfile.numberOfClients) payload.serviceProfile.numberOfClients = Number(payload.serviceProfile.numberOfClients);
    if (payload.businessDetails.teamSize) payload.businessDetails.teamSize = Number(payload.businessDetails.teamSize);
    
    if (!enabler?._id) payload.enablerId = `ENB-MANUAL-${Date.now()}`;

    // Process comma-separated fields
    payload.serviceProfile.servicesOffered = typeof payload.serviceProfile.servicesOffered === 'string' 
      ? payload.serviceProfile.servicesOffered.split(',').map(s => s.trim()).filter(Boolean) : payload.serviceProfile.servicesOffered;
    payload.capabilities.platformsSupported = typeof payload.capabilities.platformsSupported === 'string' 
      ? payload.capabilities.platformsSupported.split(',').map(s => s.trim()).filter(Boolean) : payload.capabilities.platformsSupported;
    payload.businessDetails.keyStrengths = typeof payload.businessDetails.keyStrengths === 'string' 
      ? payload.businessDetails.keyStrengths.split(',').map(s => s.trim()).filter(Boolean) : payload.businessDetails.keyStrengths;
    payload.businessDetails.certifications = typeof payload.businessDetails.certifications === 'string' 
      ? payload.businessDetails.certifications.split(',').map(s => s.trim()).filter(Boolean) : payload.businessDetails.certifications;
    payload.businessDetails.partnerships = typeof payload.businessDetails.partnerships === 'string' 
      ? payload.businessDetails.partnerships.split(',').map(s => s.trim()).filter(Boolean) : payload.businessDetails.partnerships;

    try {
      if (enabler?._id) {
        await api.updateEnabler(enabler._id, payload);
        toast.success('Enabler updated successfully');
      } else {
        await api.createEnabler(payload);
        toast.success('Enabler added successfully');
      }
      refreshData();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save enabler. Check network and required fields.');
      toast.error(err.response?.data?.message || 'Failed to save enabler');
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: 0 }}>{enabler ? 'Edit Enabler' : 'Add New Enabler'}</h2>
            <button type="button" onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f5f5', color: '#888888', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#eeeeee'} onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>
              &times;
            </button>
          </div>
          
          <form id="enabler-form" onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {error && <div style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: 12, fontSize: 14 }}>{error}</div>}
            
            <div>
              <h3 style={headingStyle}>Company Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label style={labelStyle}>Company Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="companyName" value={formData.companyName} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Owner Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="ownerName" value={formData.ownerName} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Contact Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="contactNumber" value={formData.contactNumber} onChange={handleTopLevel} style={inputStyle} pattern="[0-9]{10}" placeholder="10 digits" onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-1">
                  <label style={labelStyle}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-1">
                  <label style={labelStyle}>Status</label>
                  <select name="status" value={formData.status} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Verified">Verified</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label style={labelStyle}>Full Address</label>
                  <input type="text" value={formData.address.fullAddress} onChange={(e) => handleNested('address', 'fullAddress', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" value={formData.address.city} onChange={(e) => handleNested('address', 'city', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>District</label>
                  <input type="text" value={formData.address.district} onChange={(e) => handleNested('address', 'district', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input type="text" value={formData.address.state} onChange={(e) => handleNested('address', 'state', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Service Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label style={labelStyle}>Category</label>
                  <input type="text" value={formData.serviceProfile.category} onChange={(e) => handleNested('serviceProfile', 'category', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Years of Experience</label>
                  <input type="number" value={formData.serviceProfile.yearsOfExperience} onChange={(e) => handleNested('serviceProfile', 'yearsOfExperience', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Number of Clients</label>
                  <input type="number" value={formData.serviceProfile.numberOfClients} onChange={(e) => handleNested('serviceProfile', 'numberOfClients', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-3">
                  <label style={labelStyle}>Services Offered (comma-separated)</label>
                  <input type="text" value={formData.serviceProfile.servicesOffered} onChange={(e) => handleNested('serviceProfile', 'servicesOffered', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Client Types</label>
                  <input type="text" value={formData.serviceProfile.clientTypes} onChange={(e) => handleNested('serviceProfile', 'clientTypes', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Pricing Model</label>
                  <input type="text" value={formData.serviceProfile.pricingModel} onChange={(e) => handleNested('serviceProfile', 'pricingModel', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Service Area</label>
                  <input type="text" value={formData.serviceProfile.serviceArea} onChange={(e) => handleNested('serviceProfile', 'serviceArea', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Capabilities</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label style={labelStyle}>Platforms Supported (comma-separated)</label>
                  <input type="text" value={formData.capabilities.platformsSupported} onChange={(e) => handleNested('capabilities', 'platformsSupported', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.capabilities.supportsLocalBusinesses} onChange={(e) => handleNested('capabilities', 'supportsLocalBusinesses', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Supports Local Biz</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.capabilities.handlesEcommercePlatforms} onChange={(e) => handleNested('capabilities', 'handlesEcommercePlatforms', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Handles Ecom Platforms</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.capabilities.providesPackaging} onChange={(e) => handleNested('capabilities', 'providesPackaging', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Provides Packaging</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.capabilities.providesLogistics} onChange={(e) => handleNested('capabilities', 'providesLogistics', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Provides Logistics</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.capabilities.providesProductListing} onChange={(e) => handleNested('capabilities', 'providesProductListing', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Product Listing</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.capabilities.providesProductPhotography} onChange={(e) => handleNested('capabilities', 'providesProductPhotography', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Product Photography</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.capabilities.providesQualityAssurance} onChange={(e) => handleNested('capabilities', 'providesQualityAssurance', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Quality Assurance</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.capabilities.providesDigitalMarketing} onChange={(e) => handleNested('capabilities', 'providesDigitalMarketing', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Digital Marketing</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.capabilities.providesWarehouse} onChange={(e) => handleNested('capabilities', 'providesWarehouse', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Warehouse</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label style={labelStyle}>Tech Capability Level</label>
                  <select value={formData.businessDetails.techCapabilityLevel} onChange={(e) => handleNested('businessDetails', 'techCapabilityLevel', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="Basic">Basic</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Team Size</label>
                  <input type="number" value={formData.businessDetails.teamSize} onChange={(e) => handleNested('businessDetails', 'teamSize', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Turnover Range</label>
                  <input type="text" value={formData.businessDetails.turnoverRange} onChange={(e) => handleNested('businessDetails', 'turnoverRange', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Key Strengths (comma-separated)</label>
                  <input type="text" value={formData.businessDetails.keyStrengths} onChange={(e) => handleNested('businessDetails', 'keyStrengths', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Certifications (comma-separated)</label>
                  <input type="text" value={formData.businessDetails.certifications} onChange={(e) => handleNested('businessDetails', 'certifications', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Partnerships (comma-separated)</label>
                  <input type="text" value={formData.businessDetails.partnerships} onChange={(e) => handleNested('businessDetails', 'partnerships', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Flags & Notes</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" name="willingToOnboardLocalSellers" checked={formData.willingToOnboardLocalSellers} onChange={handleTopLevel} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Willing to Onboard Local Sellers</span>
                  </label>
                </div>
                <div>
                  <label style={labelStyle}>Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleTopLevel} rows="3" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}></textarea>
                </div>
              </div>
            </div>
          </form>

          <div style={{ background: '#fafafa', borderTop: '1px solid #e8e8e8', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>Cancel</button>
            <button type="submit" form="enabler-form" disabled={loading} style={{ background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, border: 'none', padding: '8px 16px', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, transition: 'background 0.2s' }} onMouseEnter={e => { if(!loading) e.currentTarget.style.background = '#02b870' }} onMouseLeave={e => { if(!loading) e.currentTarget.style.background = '#03D985' }}>
              {loading ? 'Saving...' : 'Save Enabler'}
            </button>
          </div>
        </div>
      </Transition>
    </>
  );
}