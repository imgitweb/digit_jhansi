import React, { useState, useRef, useEffect } from 'react';
import * as api from '../../api/industryUnder50LApi';
import Transition from '../../utils/Transition';
import { useAppToast } from '../../hooks/useAppToast';
import IndustryUploadWarningReport from './IndustryUploadWarningReport'; // NEW

export default function IndustryExcelUploader({ isOpen, onClose, refreshData }) {
  const toast = useAppToast();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [fileError, setFileError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showWarningReport, setShowWarningReport] = useState(false); // NEW
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setResult(null);
      setFileError('');
      setUploading(false);
      setDragActive(false);
      setShowWarningReport(false); // NEW
    }
  }, [isOpen]);

  const validateFile = (selectedFile) => {
    setFileError('');
    if (!selectedFile) return false;
    
    const validExtensions = /\.(xlsx|xls|csv)$/i;

    if (!selectedFile.name.match(validExtensions)) {
      setFileError('Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed.');
      toast.error('Invalid file type. Only .xlsx, .xls, or .csv allowed.');
      setFile(null);
      return false;
    }
    setFile(selectedFile);
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const loadingToastId = toast.loading('Importing Excel file...');
    setUploading(true);
    setResult(null);
    setFileError('');
    
    try {
      const res = await api.uploadIndustryExcel(file);
      setResult({ 
        success: true, 
        message: res.message, 
        inserted: res.data?.insertedCount || 0,
        updated: res.data?.modifiedCount || 0,
        warningCount: res.data?.warningCount || 0, // NEW
        reportSummary: res.data?.report?.summary || '', // NEW
        reportIssues: res.data?.report?.issues || [] // NEW
      });
      toast.dismiss(loadingToastId);
      // NEW
      toast.success(`Excel imported: ${res.data?.insertedCount || 0} added${res.data?.warningCount ? `, ${res.data.warningCount} warnings` : ''}`);
    } catch (err) {
      console.error("Upload Error:", err);
      setResult({ 
        success: false, 
        message: err.response?.data?.message || err.message || 'Network Error: Failed to reach backend.' 
      });
      toast.dismiss(loadingToastId);
      toast.error(err.response?.data?.message || 'Excel upload failed. Check file format.');
    } finally {
      setUploading(false);
    }
  };

  const handleDone = () => {
    refreshData();
    onClose();
  };

  const getDropzoneStyle = () => {
    let style = { border: '2px dashed #dddddd', borderRadius: 10, background: '#fafafa', padding: 40, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' };
    if (fileError || (result && !result.success)) {
      style.borderColor = '#ef4444'; style.background = '#fef2f2';
    } else if (dragActive) {
      style.borderColor = '#03D985'; style.background = 'rgba(3,217,133,0.04)';
    }
    return style;
  };

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
        <div style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,0.15)', width: '100%', maxWidth: 512, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ borderBottom: '1px solid #e8e8e8', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: 0 }}>Upload Industry Excel</h2>
            <button type="button" onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f5f5', color: '#888888', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#eeeeee'} onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>
              &times;
            </button>
          </div>
          
          <div style={{ padding: 24, background: '#ffffff' }}>
            {!result?.success ? (
              <>
                <div 
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  style={getDropzoneStyle()}
                  onMouseEnter={e => { if(!fileError && !result) { e.currentTarget.style.borderColor = '#03D985'; e.currentTarget.style.background = 'rgba(3,217,133,0.04)'; } }}
                  onMouseLeave={e => { if(!fileError && !result && !dragActive) { e.currentTarget.style.borderColor = '#dddddd'; e.currentTarget.style.background = '#fafafa'; } }}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx, .xls" onChange={(e) => validateFile(e.target.files[0])} style={{ display: 'none' }} />
                  <svg style={{ width: 48, height: 48, color: '#aaaaaa', margin: '0 auto 12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p style={{ fontSize: 14, color: '#666666', margin: 0, wordBreak: 'break-word' }}>
                    {file ? (
                      <span style={{ color: '#03D985', fontWeight: 600 }}>{file.name}</span>
                    ) : (
                      'Drag and drop an Excel file here, or click to browse'
                    )}
                  </p>
                </div>
                
                {fileError && <div style={{ marginTop: 12, fontSize: 14, fontWeight: 500, color: '#ef4444', textAlign: 'center' }}>{fileError}</div>}
                
                {result && !result.success && (
                  <div style={{ marginTop: 16, padding: 12, background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, fontSize: 14 }}>
                    {result.message}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(3,217,133,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg style={{ width: 32, height: 32, color: '#03D985' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111111', margin: '0 0 16px' }}>Upload Successful!</h3>
                {/* NEW: Updated stats layout for insert-only modules */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 16px', textAlign: 'center', minWidth: 100 }}>
                    <p style={{ fontSize: 24, fontWeight: 700, color: '#03D985', margin: '0 0 4px' }}>{result.inserted}</p>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#888888', textTransform: 'uppercase', margin: 0 }}>Inserted</p>
                  </div>
                  {result.warningCount > 0 && (
                    <div style={{ background: '#fffbeb', borderRadius: 8, padding: '12px 16px', textAlign: 'center', minWidth: 100, border: '1px solid #fde68a' }}>
                      <p style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b', margin: '0 0 4px' }}>{result.warningCount}</p>
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#92400e', textTransform: 'uppercase', margin: 0 }}>Warnings</p>
                    </div>
                  )}
                </div>
                {/* NEW: Warning report trigger button */}
                {result.warningCount > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <button
                      type="button"
                      onClick={() => setShowWarningReport(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: '#fffbeb',
                        border: '1px solid #fbbf24',
                        color: '#92400e',
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef3c7'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fffbeb'}
                    >
                      <svg style={{ width: 16, height: 16, color: '#f59e0b', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      See Warnings ({result.warningCount} rows with data issues)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div style={{ background: '#fafafa', borderTop: '1px solid #e8e8e8', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            {!result?.success ? (
              <>
                <button type="button" onClick={onClose} style={{ background: '#ffffff', border: '1px solid #dddddd', color: '#555555', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>Cancel</button>
                <button type="button" onClick={handleUpload} disabled={!file || uploading} style={{ background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, border: 'none', padding: '8px 16px', fontSize: 14, display: 'flex', alignItems: 'center', cursor: (!file || uploading) ? 'not-allowed' : 'pointer', opacity: (!file || uploading) ? 0.5 : 1, transition: 'background 0.2s' }} onMouseEnter={e => { if(file && !uploading) e.currentTarget.style.background = '#02b870' }} onMouseLeave={e => { if(file && !uploading) e.currentTarget.style.background = '#03D985' }}>
                  {uploading && (
                    <svg style={{ animation: 'spin 1s linear infinite', marginLeft: -4, marginRight: 8, height: 16, width: 16, color: '#000' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {uploading ? 'Processing...' : 'Upload & Import'}
                </button>
              </>
            ) : (
              <button type="button" onClick={handleDone} style={{ background: '#03D985', color: '#000000', fontWeight: 700, borderRadius: 8, border: 'none', padding: '8px 16px', fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#02b870'} onMouseLeave={e => e.currentTarget.style.background = '#03D985'}>Done</button>
            )}
          </div>
        </div>
      </Transition>
      {/* NEW: Warning report drawer */}
      <IndustryUploadWarningReport
        isOpen={showWarningReport}
        onClose={() => setShowWarningReport(false)}
        warningCount={result?.warningCount || 0}
        reportSummary={result?.reportSummary || ''}
        reportIssues={result?.reportIssues || []}
      />
    </>
  );
}