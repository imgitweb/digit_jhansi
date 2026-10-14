import React, { useState, useEffect } from 'react';
import * as api from '../../api/industry50LPlusApi';
import Transition from '../../utils/Transition';
import { useAppToast } from '../../hooks/useAppToast';

const emptyForm = {
  companyName: '', ownerCeoName: '', phoneNumber: '', email: '', websiteUrl: '', status: 'Active',
  businessCategory: '', industryType: '', natureOfBusiness: '', shortCompanyProfile: '', yearEstablished: '',
  notes: '',
  address: { fullAddress: '', city: '', district: '', state: '' },
  compliance: { msmeRegistered: false, gstRegistered: false, companyRegistrationType: '', certifications: '' },
  scale: { lastYearTurnover: '', numberOfEmployees: '', supplyCapacity: '', investmentRequirement: '' },
  products: { keyProductsServices: '', majorClients: '', operationalArea: '', logisticsPartners: '' },
  export: { exportsCurrently: false, exportCountries: '', exportRevenuePercentage: '', willingToExport: false, exportReadinessLevel: '' },
  digital: { technologyUsageLevel: '', digitalPresenceLevel: '', ecommerceEnabled: false },
  needs: { hiringNeeds: '', skillGaps: '', keyChallenges: '', expansionPlans: '' }
};

export default function Industry50LFormModal({ isOpen, onClose, industry, refreshData }) {
  const toast = useAppToast();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (industry) {
      setFormData({
        ...emptyForm, ...industry,
        address: { ...emptyForm.address, ...industry.address },
        compliance: { 
          ...emptyForm.compliance, ...industry.compliance, 
          certifications: industry.compliance?.certifications ? industry.compliance.certifications.join(', ') : '' 
        },
        scale: { ...emptyForm.scale, ...industry.scale },
        products: { 
          ...emptyForm.products, ...industry.products, 
          logisticsPartners: industry.products?.logisticsPartners ? industry.products.logisticsPartners.join(', ') : '' 
        },
        export: { 
          ...emptyForm.export, ...industry.export, 
          exportCountries: industry.export?.exportCountries ? industry.export.exportCountries.join(', ') : '' 
        },
        digital: { ...emptyForm.digital, ...industry.digital },
        needs: { ...emptyForm.needs, ...industry.needs }
      });
    } else {
      setFormData(emptyForm);
    }
  }, [industry]);

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
    
    if (payload.yearEstablished) payload.yearEstablished = Number(payload.yearEstablished);
    if (payload.scale.lastYearTurnover) payload.scale.lastYearTurnover = Number(payload.scale.lastYearTurnover);
    if (payload.scale.numberOfEmployees) payload.scale.numberOfEmployees = Number(payload.scale.numberOfEmployees);
    if (payload.scale.investmentRequirement) payload.scale.investmentRequirement = Number(payload.scale.investmentRequirement);
    if (payload.export.exportRevenuePercentage) payload.export.exportRevenuePercentage = Number(payload.export.exportRevenuePercentage);
    
    if (!industry?._id) payload.industryId = `IND50P-MANUAL-${Date.now()}`;

    payload.compliance.certifications = typeof payload.compliance.certifications === 'string' 
      ? payload.compliance.certifications.split(',').map(s => s.trim()).filter(Boolean) : payload.compliance.certifications;
    payload.products.logisticsPartners = typeof payload.products.logisticsPartners === 'string' 
      ? payload.products.logisticsPartners.split(',').map(s => s.trim()).filter(Boolean) : payload.products.logisticsPartners;
    payload.export.exportCountries = typeof payload.export.exportCountries === 'string' 
      ? payload.export.exportCountries.split(',').map(s => s.trim()).filter(Boolean) : payload.export.exportCountries;

    try {
      if (industry?._id) {
        await api.updateIndustry50L(industry._id, payload);
        toast.success('Enterprise record updated successfully');
      } else {
        await api.createIndustry50L(payload);
        toast.success('Enterprise record added successfully');
      }
      refreshData();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save industry. Check network and required fields.');
      toast.error(err.response?.data?.message || 'Failed to save enterprise record');
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: 0 }}>{industry ? 'Edit Industry (50L+)' : 'Add New Industry (50L+)'}</h2>
            <button type="button" onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f5f5', color: '#888888', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#eeeeee'} onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>
              &times;
            </button>
          </div>
          
          <form id="industry-50l-form" onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {error && <div style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: 12, fontSize: 14 }}>{error}</div>}
            
            <div>
              <h3 style={headingStyle}>Company Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label style={labelStyle}>Company Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="companyName" value={formData.companyName} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Owner/CEO Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="ownerCeoName" value={formData.ownerCeoName} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleTopLevel} style={inputStyle} pattern="[0-9]{10}" placeholder="10 digits" onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Website URL</label>
                  <input type="text" name="websiteUrl" value={formData.websiteUrl} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-1">
                  <label style={labelStyle}>Status</label>
                  <select name="status" value={formData.status} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Verified">Verified</option>
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label style={labelStyle}>Year Established</label>
                  <input type="number" name="yearEstablished" value={formData.yearEstablished} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Business Category</label>
                  <input type="text" name="businessCategory" value={formData.businessCategory} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Industry Type</label>
                  <input type="text" name="industryType" value={formData.industryType} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-4">
                  <label style={labelStyle}>Nature of Business</label>
                  <input type="text" name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-4">
                  <label style={labelStyle}>Short Company Profile</label>
                  <textarea name="shortCompanyProfile" value={formData.shortCompanyProfile} onChange={handleTopLevel} rows="2" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}></textarea>
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
              <h3 style={headingStyle}>Compliance & Scale</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                  <label style={labelStyle}>Company Reg. Type</label>
                  <input type="text" value={formData.compliance.companyRegistrationType} onChange={(e) => handleNested('compliance', 'companyRegistrationType', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Certifications (comma-separated)</label>
                  <input type="text" value={formData.compliance.certifications} onChange={(e) => handleNested('compliance', 'certifications', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Turnover (₹)</label>
                  <input type="number" value={formData.scale.lastYearTurnover} onChange={(e) => handleNested('scale', 'lastYearTurnover', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>No. Employees</label>
                  <input type="number" value={formData.scale.numberOfEmployees} onChange={(e) => handleNested('scale', 'numberOfEmployees', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Supply Capacity</label>
                  <input type="text" value={formData.scale.supplyCapacity} onChange={(e) => handleNested('scale', 'supplyCapacity', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Investment Req. (₹)</label>
                  <input type="number" value={formData.scale.investmentRequirement} onChange={(e) => handleNested('scale', 'investmentRequirement', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-4 flex space-x-6 pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.compliance.msmeRegistered} onChange={(e) => handleNested('compliance', 'msmeRegistered', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>MSME Registered</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.compliance.gstRegistered} onChange={(e) => handleNested('compliance', 'gstRegistered', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>GST Registered</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Products & Market</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label style={labelStyle}>Key Products/Services</label>
                  <input type="text" value={formData.products.keyProductsServices} onChange={(e) => handleNested('products', 'keyProductsServices', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Major Clients</label>
                  <input type="text" value={formData.products.majorClients} onChange={(e) => handleNested('products', 'majorClients', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Operational Area</label>
                  <input type="text" value={formData.products.operationalArea} onChange={(e) => handleNested('products', 'operationalArea', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Logistics Partners (comma-separated)</label>
                  <input type="text" value={formData.products.logisticsPartners} onChange={(e) => handleNested('products', 'logisticsPartners', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Export</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label style={labelStyle}>Export Countries (comma-separated)</label>
                  <input type="text" value={formData.export.exportCountries} onChange={(e) => handleNested('export', 'exportCountries', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Export Revenue %</label>
                  <input type="number" value={formData.export.exportRevenuePercentage} onChange={(e) => handleNested('export', 'exportRevenuePercentage', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-3">
                  <label style={labelStyle}>Export Readiness Level</label>
                  <input type="text" value={formData.export.exportReadinessLevel} onChange={(e) => handleNested('export', 'exportReadinessLevel', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-3 flex space-x-6 pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.export.exportsCurrently} onChange={(e) => handleNested('export', 'exportsCurrently', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Currently Exports</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.export.willingToExport} onChange={(e) => handleNested('export', 'willingToExport', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Willing to Export</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Digital & Technology</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label style={labelStyle}>Technology Usage Level</label>
                  <select value={formData.digital.technologyUsageLevel} onChange={(e) => handleNested('digital', 'technologyUsageLevel', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="Basic">Basic</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Digital Presence Level</label>
                  <select value={formData.digital.digitalPresenceLevel} onChange={(e) => handleNested('digital', 'digitalPresenceLevel', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex space-x-6 pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.digital.ecommerceEnabled} onChange={(e) => handleNested('digital', 'ecommerceEnabled', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Ecommerce Enabled</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Business Needs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Hiring Needs</label>
                  <input type="text" value={formData.needs.hiringNeeds} onChange={(e) => handleNested('needs', 'hiringNeeds', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Skill Gaps</label>
                  <input type="text" value={formData.needs.skillGaps} onChange={(e) => handleNested('needs', 'skillGaps', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Key Challenges</label>
                  <textarea value={formData.needs.keyChallenges} onChange={(e) => handleNested('needs', 'keyChallenges', e.target.value)} rows="2" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}></textarea>
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Expansion Plans</label>
                  <textarea value={formData.needs.expansionPlans} onChange={(e) => handleNested('needs', 'expansionPlans', e.target.value)} rows="2" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}></textarea>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Notes</h3>
              <div>
                <label style={labelStyle}>System Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleTopLevel} rows="3" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}></textarea>
              </div>
            </div>
          </form>

          <div style={{ background: '#fafafa', borderTop: '1px solid #e8e8e8', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>Cancel</button>
            <button type="submit" form="industry-50l-form" disabled={loading} style={{ background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, border: 'none', padding: '8px 16px', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, transition: 'background 0.2s' }} onMouseEnter={e => { if(!loading) e.currentTarget.style.background = '#02b870' }} onMouseLeave={e => { if(!loading) e.currentTarget.style.background = '#03D985' }}>
              {loading ? 'Saving...' : 'Save Industry'}
            </button>
          </div>
        </div>
      </Transition>
    </>
  );
}