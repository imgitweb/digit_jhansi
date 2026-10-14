import React from 'react';
import Transition from '../../utils/Transition';

export default function InstitutionUploadWarningReport({ isOpen, onClose, warningCount, reportSummary, reportIssues }) {
  return (
    <>
      <Transition
        unmountOnExit={true}
        className="fixed inset-0 z-[110] bg-gray-900 bg-opacity-50 transition-opacity"
        show={isOpen}
        enter="transition ease-out duration-200" enterStart="opacity-0" enterEnd="opacity-100"
        leave="transition ease-out duration-100" leaveStart="opacity-100" leaveEnd="opacity-0"
        aria-hidden="true"
        onClick={onClose}
      />
      
      <Transition
        unmountOnExit={true}
        className="fixed inset-y-0 right-0 z-[111] w-full max-w-2xl bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out"
        show={isOpen}
        enter="transition ease-in-out duration-300" enterStart="translate-x-full" enterEnd="translate-x-0"
        leave="transition ease-in-out duration-300" leaveStart="translate-x-0" leaveEnd="translate-x-full"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffbeb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg style={{ width: 24, height: 24, color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#92400e', margin: 0 }}>Import Warnings</h2>
                <p style={{ fontSize: 13, color: '#b45309', margin: 0, marginTop: 2 }}>{warningCount} rows with data quality issues</p>
              </div>
            </div>
            <button type="button" onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: 'transparent', color: '#b45309', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div style={{ padding: '16px 24px', background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#555555', lineHeight: 1.5 }}>
              {reportSummary || "The following rows were imported but had missing or invalid data in key fields. You can update them manually later."}
            </p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#ffffff', zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <tr>
                  <th style={{ padding: '12px 24px', fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', borderBottom: '1px solid #e8e8e8', width: 80 }}>Row #</th>
                  <th style={{ padding: '12px 24px', fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', borderBottom: '1px solid #e8e8e8' }}>Institution Data</th>
                  <th style={{ padding: '12px 24px', fontSize: 11, fontWeight: 700, color: '#888888', textTransform: 'uppercase', borderBottom: '1px solid #e8e8e8' }}>Issues Detected</th>
                </tr>
              </thead>
              <tbody>
                {reportIssues.map((issue, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, color: '#111111', verticalAlign: 'top' }}>
                      {issue.rowNumber}
                    </td>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#333333', marginBottom: 4 }}>{issue.institutionName || '(Empty)'}</div>
                      <div style={{ fontSize: 12, color: '#666666', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span>P: {issue.phone || '-'}</span>
                        <span>E: {issue.email || '-'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <ul style={{ margin: 0, paddingLeft: 16, color: '#d97706', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {issue.issues.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
    </>
  );
}