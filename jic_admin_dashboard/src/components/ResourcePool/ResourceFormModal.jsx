import React, { useState, useEffect } from 'react';
import * as api from '../../api/resourceApi';
import Transition from '../../utils/Transition';
import { useAppToast } from '../../hooks/useAppToast';

const emptyForm = {
  fullName: '', phoneNumber: '', email: '', gender: '', age: '', dateOfBirth: '', status: 'Active', notes: '',
  address: { fullAddress: '', village: '', block: '', district: '', state: '' },
  education: { highestQualification: '', degreeName: '', specialization: '', collegeUniversity: '', passoutYear: '' },
  employment: { currentStatus: '', employerName: '', jobRole: '', yearsOfExperience: '', lastMonthSalary: '' },
  skills: { primary: { name: '', level: '' }, secondary: { name: '', level: '' }, tertiary: { name: '', level: '' } },
  workPreference: { preferredWorkType: '', expectedSalary: '', availability: '' },
  digitalProfile: { digitalLiteracyLevel: '', languagesKnown: '', certifications: '', ownsSmartphone: false, hasInternetAccess: false },
  flags: { willingToRelocate: false, willingForTraining: false },
  interests: ['', '', '']
};

export default function ResourceFormModal({ isOpen, onClose, resource, refreshData }) {
  const toast = useAppToast();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (resource) {
      setFormData({
        ...emptyForm, ...resource,
        dateOfBirth: resource.dateOfBirth ? new Date(resource.dateOfBirth).toISOString().split('T')[0] : '',
        address: { ...emptyForm.address, ...(resource.address || {}) },
        education: { ...emptyForm.education, ...(resource.education || {}) },
        employment: { ...emptyForm.employment, ...(resource.employment || {}) },
        skills: {
          primary: { ...emptyForm.skills.primary, ...(resource.skills?.primary || {}) },
          secondary: { ...emptyForm.skills.secondary, ...(resource.skills?.secondary || {}) },
          tertiary: { ...emptyForm.skills.tertiary, ...(resource.skills?.tertiary || {}) }
        },
        workPreference: { ...emptyForm.workPreference, ...(resource.workPreference || {}) },
        digitalProfile: { ...emptyForm.digitalProfile, ...(resource.digitalProfile || {}) },
        flags: { ...emptyForm.flags, ...(resource.flags || {}) },
        interests: resource.interests?.length ? [...resource.interests, '', '', ''].slice(0,3) : ['', '', '']
      });
    } else {
      setFormData(emptyForm);
    }
  }, [resource]);

  const handleTopLevel = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNested = (section, field, value) => setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  const handleDeepNested = (section, subSection, field, value) => setFormData(prev => ({ ...prev, [section]: { ...prev[section], [subSection]: { ...prev[section][subSection], [field]: value } } }));
  const handleInterestChange = (index, value) => {
    const newInterests = [...formData.interests];
    newInterests[index] = value;
    setFormData(prev => ({ ...prev, interests: newInterests }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const payload = JSON.parse(JSON.stringify(formData));
    payload.age = payload.age === '' ? null : Number(payload.age);
    payload.employment.yearsOfExperience = payload.employment.yearsOfExperience === '' ? 0 : Number(payload.employment.yearsOfExperience);
    
    if (!resource?._id) payload.resourceId = `RES-MANUAL-${Date.now()}`;

    payload.digitalProfile.languagesKnown = typeof payload.digitalProfile.languagesKnown === 'string' 
      ? payload.digitalProfile.languagesKnown.split(',').map(s => s.trim()).filter(Boolean)
      : payload.digitalProfile.languagesKnown;
      
    payload.digitalProfile.certifications = typeof payload.digitalProfile.certifications === 'string' 
      ? payload.digitalProfile.certifications.split(',').map(s => s.trim()).filter(Boolean)
      : payload.digitalProfile.certifications;

    try {
      if (resource?._id) {
        await api.updateResource(resource._id, payload);
        toast.success('Resource updated successfully');
      } else {
        await api.createResource(payload);
        toast.success('Resource added successfully');
      }
      refreshData();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save resource. Check network and required fields.');
      toast.error(err.response?.data?.message || 'Failed to save resource');
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: 0 }}>{resource ? 'Edit Resource' : 'Add New Resource'}</h2>
            <button type="button" onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f5f5', color: '#888888', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#eeeeee'} onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>
              &times;
            </button>
          </div>
          
          <form id="resource-form" onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {error && <div style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: 12, fontSize: 14 }}>{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                <input required type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleTopLevel} style={inputStyle} pattern="[0-9]{10}" placeholder="10 digits" onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" value={formData.status} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Placed">Placed</option>
                  <option value="Blacklisted">Blacklisted</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                  <option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
              </div>
              <div>
                <label style={labelStyle}>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-4">
                  <label style={labelStyle}>Full Address</label>
                  <input type="text" value={formData.address.fullAddress} onChange={(e) => handleNested('address', 'fullAddress', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Village/Ward</label>
                  <input type="text" value={formData.address.village} onChange={(e) => handleNested('address', 'village', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Block</label>
                  <input type="text" value={formData.address.block} onChange={(e) => handleNested('address', 'block', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
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
              <h3 style={headingStyle}>Skills & Employment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label style={labelStyle}>Primary Skill</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Name" value={formData.skills.primary.name} onChange={(e) => handleDeepNested('skills', 'primary', 'name', e.target.value)} style={{ ...inputStyle, width: '66.666%' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                    <input type="text" placeholder="Level" value={formData.skills.primary.level} onChange={(e) => handleDeepNested('skills', 'primary', 'level', e.target.value)} style={{ ...inputStyle, width: '33.333%' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Secondary Skill</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Name" value={formData.skills.secondary.name} onChange={(e) => handleDeepNested('skills', 'secondary', 'name', e.target.value)} style={{ ...inputStyle, width: '66.666%' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                    <input type="text" placeholder="Level" value={formData.skills.secondary.level} onChange={(e) => handleDeepNested('skills', 'secondary', 'level', e.target.value)} style={{ ...inputStyle, width: '33.333%' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Tertiary Skill</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Name" value={formData.skills.tertiary.name} onChange={(e) => handleDeepNested('skills', 'tertiary', 'name', e.target.value)} style={{ ...inputStyle, width: '66.666%' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                    <input type="text" placeholder="Level" value={formData.skills.tertiary.level} onChange={(e) => handleDeepNested('skills', 'tertiary', 'level', e.target.value)} style={{ ...inputStyle, width: '33.333%' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Employment Status</label>
                  <select value={formData.employment.currentStatus} onChange={(e) => handleNested('employment', 'currentStatus', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="Employed">Employed</option><option value="Unemployed">Unemployed</option><option value="Freelancer">Freelancer</option><option value="Self-Employed">Self-Employed</option><option value="Student">Student</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Job Role</label>
                  <input type="text" value={formData.employment.jobRole} onChange={(e) => handleNested('employment', 'jobRole', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Experience (Years)</label>
                  <input type="number" value={formData.employment.yearsOfExperience} onChange={(e) => handleNested('employment', 'yearsOfExperience', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Education & Digital Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label style={labelStyle}>Highest Qual.</label>
                  <input type="text" value={formData.education.highestQualification} onChange={(e) => handleNested('education', 'highestQualification', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Degree Name</label>
                  <input type="text" value={formData.education.degreeName} onChange={(e) => handleNested('education', 'degreeName', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Institution</label>
                  <input type="text" value={formData.education.collegeUniversity} onChange={(e) => handleNested('education', 'collegeUniversity', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Digital Literacy</label>
                  <select value={formData.digitalProfile.digitalLiteracyLevel} onChange={(e) => handleNested('digitalProfile', 'digitalLiteracyLevel', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="None">None</option><option value="Basic">Basic</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Languages Known (comma separated)</label>
                  <input type="text" value={Array.isArray(formData.digitalProfile.languagesKnown) ? formData.digitalProfile.languagesKnown.join(', ') : formData.digitalProfile.languagesKnown} onChange={(e) => handleNested('digitalProfile', 'languagesKnown', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2 flex items-center space-x-6 mt-4">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.digitalProfile.ownsSmartphone} onChange={(e) => handleNested('digitalProfile', 'ownsSmartphone', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Owns Smartphone</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.digitalProfile.hasInternetAccess} onChange={(e) => handleNested('digitalProfile', 'hasInternetAccess', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Has Internet</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Preferences & Notes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label style={labelStyle}>Interest 1</label>
                  <input type="text" value={formData.interests[0]} onChange={(e) => handleInterestChange(0, e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Interest 2</label>
                  <input type="text" value={formData.interests[1]} onChange={(e) => handleInterestChange(1, e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Interest 3</label>
                  <input type="text" value={formData.interests[2]} onChange={(e) => handleInterestChange(2, e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                
                <div>
                  <label style={labelStyle}>Work Type</label>
                  <select value={formData.workPreference.preferredWorkType} onChange={(e) => handleNested('workPreference', 'preferredWorkType', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Freelance">Freelance</option><option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Availability</label>
                  <select value={formData.workPreference.availability} onChange={(e) => handleNested('workPreference', 'availability', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option><option value="Immediate">Immediate</option><option value="1 Month">1 Month</option><option value="2 Months">2 Months</option><option value="3 Months+">3 Months+</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-6 mt-4">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.flags.willingToRelocate} onChange={(e) => handleNested('flags', 'willingToRelocate', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Willing to Relocate</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.flags.willingForTraining} onChange={(e) => handleNested('flags', 'willingForTraining', e.target.checked)} className="accent-[#03D985] w-4 h-4 cursor-pointer" />
                    <span style={{ fontSize: 13, marginLeft: 8, color: '#333333' }}>Willing for Training</span>
                  </label>
                </div>

                <div className="md:col-span-3">
                  <label style={labelStyle}>Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleTopLevel} rows="3" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}></textarea>
                </div>
              </div>
            </div>
          </form>

          <div style={{ background: '#fafafa', borderTop: '1px solid #e8e8e8', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>Cancel</button>
            <button type="submit" form="resource-form" disabled={loading} style={{ background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, border: 'none', padding: '8px 16px', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, transition: 'background 0.2s' }} onMouseEnter={e => { if(!loading) e.currentTarget.style.background = '#02b870' }} onMouseLeave={e => { if(!loading) e.currentTarget.style.background = '#03D985' }}>
              {loading ? 'Saving...' : 'Save Resource'}
            </button>
          </div>
        </div>
      </Transition>
    </>
  );
}