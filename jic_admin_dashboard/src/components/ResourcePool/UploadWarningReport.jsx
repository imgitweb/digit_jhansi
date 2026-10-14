import React, { useState, useEffect } from 'react';

/**
 * @component UploadWarningReport
 * @description Reusable warning report drawer for Excel upload ingestion modules.
 * Shows data quality issues per row. All flagged rows are still saved — warnings are informational only.
 * @prop {boolean} isOpen
 * @prop {function} onClose
 * @prop {number} warningCount
 * @prop {string} reportSummary
 * @prop {Array} reportIssues
 */
export default function UploadWarningReport({
  isOpen,
  onClose,
  warningCount,
  reportSummary,
  reportIssues
}) {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      // Small timeout to allow DOM to render before triggering the slide-in transform
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      // Wait for transform animation to finish before unmounting
      setTimeout(() => setRender(false), 300);
    }
  }, [isOpen]);

  if (!render) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          cursor: 'pointer'
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 480,
          background: '#ffffff',
          boxShadow: '0 0 40px rgba(0,0,0,0.2)',
          zIndex: 201,
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header Section */}
        <div style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg style={{ width: 20, height: 20, color: '#f59e0b', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 style={{ margin: 0, color: '#92400e', fontWeight: 700, fontSize: 16 }}>Data Quality Warnings</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#fef3c7',
                color: '#92400e',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                lineHeight: 1,
                padding: 0
              }}
            >
              &times;
            </button>
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#a16207', lineHeight: 1.4 }}>
            {reportSummary}
          </p>
          <span style={{
            display: 'inline-block',
            background: '#fef3c7',
            color: '#92400e',
            border: '1px solid #fbbf24',
            borderRadius: 20,
            padding: '2px 10px',
            fontSize: 12,
            fontWeight: 600
          }}>
            {warningCount} rows flagged
          </span>
        </div>

        {/* Info Banner */}
        <div style={{
          background: 'rgba(3,217,133,0.08)',
          borderBottom: '1px solid rgba(3,217,133,0.2)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{ fontSize: 12, color: '#065f46', fontWeight: 500 }}>
            ✓ All flagged rows were still saved to the database. These are informational warnings only.
          </span>
        </div>

        {/* Scrollable Issues List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', background: '#ffffff' }}>
          {reportIssues.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <svg style={{ width: 48, height: 48, color: '#03D985', margin: '0 auto 12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p style={{ margin: 0, color: '#888888', fontSize: 14 }}>No issues found. All rows were clean.</p>
            </div>
          ) : (
            reportIssues.map((issue, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1px solid #e8e8e8',
                borderRadius: 10,
                padding: '14px 16px',
                marginBottom: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                {/* Card Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    background: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fbbf24',
                    borderRadius: 20,
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    Row {issue.rowNumber}
                  </span>
                  {issue.fullName !== '(blank)' && (
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111111' }}>
                      {issue.fullName}
                    </span>
                  )}
                </div>

                {/* Contact Info Row */}
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {issue.phoneNumber === '(blank)' ? (
                    <span style={{ background: '#fef2f2', color: '#ef4444', fontSize: 11, borderRadius: 6, padding: '2px 8px' }}>(no phone)</span>
                  ) : (
                    <span style={{ background: '#f3f4f6', color: '#374151', fontSize: 11, borderRadius: 6, padding: '2px 8px' }}>{issue.phoneNumber}</span>
                  )}
                  
                  {issue.email === '(blank)' ? (
                    <span style={{ background: '#fef2f2', color: '#ef4444', fontSize: 11, borderRadius: 6, padding: '2px 8px' }}>(no email)</span>
                  ) : (
                    <span style={{ background: '#f3f4f6', color: '#374151', fontSize: 11, borderRadius: 6, padding: '2px 8px' }}>{issue.email}</span>
                  )}
                </div>

                {/* Issues List */}
                <div style={{ marginTop: 10 }}>
                  {issue.issues.map((errText, errIdx) => (
                    <div key={errIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                      <span style={{ color: '#ef4444', fontSize: 10, marginTop: 4 }}>●</span>
                      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                        {errText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e8e8e8', padding: '16px 24px', background: '#fafafa' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              background: '#111111',
              color: '#ffffff',
              fontWeight: 700,
              borderRadius: 8,
              border: 'none',
              padding: 10,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#333333'}
            onMouseLeave={e => e.currentTarget.style.background = '#111111'}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}