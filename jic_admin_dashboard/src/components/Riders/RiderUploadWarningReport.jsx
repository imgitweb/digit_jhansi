import React, { useState, useEffect } from 'react';

export default function RiderUploadWarningReport({
  isOpen,
  onClose,
  warningCount,
  reportSummary,
  reportIssues
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          transition: 'opacity 0.3s ease',
          opacity: visible ? 1 : 0
        }}
      />
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: 480,
        maxWidth: '100vw',
        height: '100vh',
        background: '#ffffff',
        boxShadow: '0 0 40px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a', padding: '20px 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg style={{ width: 20, height: 20, color: '#f59e0b', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#92400e' }}>Data Quality Warnings</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: '50%', background: '#fef3c7', color: '#92400e', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, transition: 'background 0.2s', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.background = '#fde68a'}
              onMouseLeave={e => e.currentTarget.style.background = '#fef3c7'}
            >&times;</button>
          </div>
          <p style={{ fontSize: 13, color: '#a16207', margin: '0 0 10px', lineHeight: 1.5 }}>{reportSummary}</p>
          <span style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', border: '1px solid #fbbf24', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
            {warningCount} rows flagged
          </span>
        </div>

        <div style={{ background: 'rgba(3,217,133,0.08)', borderBottom: '1px solid rgba(3,217,133,0.2)', padding: '10px 24px', flexShrink: 0 }}>
          <p style={{ fontSize: 12, color: '#065f46', fontWeight: 500, margin: 0 }}>
            ✓ All flagged rows were still saved to the database. These are informational warnings only.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {reportIssues.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
              <svg style={{ width: 40, height: 40, color: '#03D985' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p style={{ fontSize: 14, color: '#888888', margin: 0 }}>No issues found. All rows were clean.</p>
            </div>
          ) : (
            reportIssues.map((issue, index) => (
              <div key={index} style={{ background: '#ffffff', border: '1px solid #e8e8e8', borderRadius: 10, padding: '14px 16px', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                
                {/* Card header: Row badge + rider name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fbbf24', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    Row {issue.rowNumber}
                  </span>
                  {issue.fullName !== '(blank)' && (
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {issue.fullName}
                    </span>
                  )}
                </div>

                {/* Contact/location info pills */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{
                    background: issue.phoneNumber === '(blank)' ? '#fef2f2' : '#f3f4f6',
                    color: issue.phoneNumber === '(blank)' ? '#ef4444' : '#374151',
                    borderRadius: 6, padding: '2px 8px', fontSize: 11
                  }}>
                    📞 {issue.phoneNumber === '(blank)' ? '(no phone)' : issue.phoneNumber}
                  </span>
                  <span style={{
                    background: issue.city === '(blank)' ? '#fef2f2' : '#f3f4f6',
                    color: issue.city === '(blank)' ? '#ef4444' : '#374151',
                    borderRadius: 6, padding: '2px 8px', fontSize: 11
                  }}>
                    📍 {issue.city === '(blank)' ? '(no city)' : issue.city}
                  </span>
                </div>

                {/* Issues list */}
                <div>
                  {issue.issues.map((issueText, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                      <span style={{ color: '#ef4444', fontSize: 10, marginTop: 3, flexShrink: 0 }}>●</span>
                      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{issueText}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: '1px solid #e8e8e8', padding: '16px 24px', background: '#fafafa', flexShrink: 0 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ width: '100%', background: '#111111', color: '#ffffff', fontWeight: 700, borderRadius: 8, border: 'none', padding: 10, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#333333'}
            onMouseLeave={e => e.currentTarget.style.background = '#111111'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}