import React, { useState, useEffect } from 'react';
import * as api from '../../api/institutionApi';
import Transition from '../../utils/Transition';
import { useAppToast } from '../../hooks/useAppToast';

const emptyForm = {
  institutionName: '',
  phone: '',
  email: '',
  address: '',
  institutionType: '',
  affiliation: '',
  coursesOffered: '',
  website: '',
  status: 'Active'
};

export default function InstitutionFormModal({ isOpen, onClose, institution, refreshData }) {
  const toast = useAppToast();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (institution) {
      setFormData({ ...emptyForm, ...institution });
    } else {
      setFormData(emptyForm);
    }
  }, [institution]);

  const handleTopLevel = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const payload = { ...formData };

    try {
      if (institution?._id) {
        await api.updateInstitution(institution._id, payload);
        toast.success('Institution updated successfully');
      } else {
        await api.createInstitution(payload);
        toast.success('Institution added successfully');
      }
      refreshData();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save institution. Check network and required fields.');
      toast.error(err.response?.data?.message || 'Failed to save institution');
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
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: 0 }}>{institution ? 'Edit Institution' : 'Add New Institution'}</h2>
            <button type="button" onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f5f5', color: '#888888', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#eeeeee'} onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>
              &times;
            </button>
          </div>
          
          <form id="institution-form" onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {error && <div style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: 12, fontSize: 14 }}>{error}</div>}
            
            <div>
              <h3 style={headingStyle}>Basic Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label style={labelStyle}>Institution Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input required type="text" name="institutionName" value={formData.institutionName} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleTopLevel} style={inputStyle} placeholder="e.g. 07672-222292" onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
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
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 style={headingStyle}>Institution Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Institution Type</label>
                  <select name="institutionType" value={formData.institutionType} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}>
                    <option value="">Select...</option>
                    <option value="School (Private)">School (Private)</option>
                    <option value="School (Govt.)">School (Govt.)</option>
                    <option value="College (Govt.)">College (Govt.)</option>
                    <option value="College (Private)">College (Private)</option>
                    <option value="College (Govt., Autonomous)">College (Govt., Autonomous)</option>
                    <option value="University (Private)">University (Private)</option>
                    <option value="Polytechnic (Govt.)">Polytechnic (Govt.)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Affiliation</label>
                  <input type="text" name="affiliation" value={formData.affiliation} onChange={handleTopLevel} style={inputStyle} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Address</label>
                  <textarea name="address" value={formData.address} onChange={handleTopLevel} rows="2" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}></textarea>
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Website</label>
                  <input type="url" name="website" value={formData.website} onChange={handleTopLevel} style={inputStyle} placeholder="https://..." onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Courses Offered</label>
                  <textarea name="coursesOffered" value={formData.coursesOffered} onChange={handleTopLevel} rows="3" style={{ ...inputStyle, resize: 'vertical' }} placeholder="e.g. B.Sc., M.A., B.Com." onFocus={e => e.target.style.borderColor = '#03D985'} onBlur={e => e.target.style.borderColor = '#dddddd'}></textarea>
                </div>
              </div>
            </div>
          </form>

          <div style={{ background: '#fafafa', borderTop: '1px solid #e8e8e8', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={onClose} style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>Cancel</button>
            <button type="submit" form="institution-form" disabled={loading} style={{ background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, border: 'none', padding: '8px 16px', fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, transition: 'background 0.2s' }} onMouseEnter={e => { if(!loading) e.currentTarget.style.background = '#02b870' }} onMouseLeave={e => { if(!loading) e.currentTarget.style.background = '#03D985' }}>
              {loading ? 'Saving...' : 'Save Institution'}
            </button>
          </div>
        </div>
      </Transition>
    </>
  );
}