import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
        <svg className="animate-spin" style={{ width: 40, height: 40, color: '#03D985' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5', overflow: 'hidden' }}>
      
      {/* Left Panel - Branding (Hidden on Mobile) */}
      <div 
        className="hidden lg:flex" 
        style={{
          width: '50%',
          background: '#0a0a0a',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, opacity: 1,
          background: 'radial-gradient(ellipse at 10% 100%, rgba(3,217,133,0.25) 0%, rgba(3,217,133,0.08) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        
        <div className="max-w-md text-left z-10">
          <svg style={{ fill: '#03D985', marginBottom: 24 }} xmlns="http://www.w3.org/2000/svg" width={48} height={48}>
            <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
          </svg>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#ffffff', marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Jhansi PRD Admin Dashboard
          </h1>
          <p style={{ fontSize: 15, color: '#888888', marginBottom: 40, lineHeight: 1.5 }}>
            Industry & Commerce Intelligence Platform
          </p>
          <ul className="space-y-4">
            {['Resource Hub', 'Riders Database', 'Ecommerce Enablers', 'Industry Pool (<50L)', 'Industry Pool (50L+)'].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', color: '#cccccc', marginBottom: 12 }}>
                <svg style={{ width: 18, height: 18, color: '#03D985', marginRight: 10, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Bottom Green Glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: '40%',
          background: 'radial-gradient(ellipse at 20% 100%, rgba(3,217,133,0.3) 0%, rgba(3,217,133,0.1) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Right Panel - Form */}
      <div 
        className="lg:w-1/2"
        style={{
          width: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          padding: '24px', overflowY: 'auto',
          background: '#f5f5f5',
        }}
      >
        <div style={{
          width: '100%', maxWidth: 440,
          background: '#ffffff',
          padding: '40px',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8',
        }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111111', marginBottom: 8, letterSpacing: '-0.01em' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: 14, color: '#888888' }}>
              Sign in to your admin account
            </p>
          </div>
          
          {error && (
            <div style={{
              marginBottom: 24, padding: '12px 16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <svg style={{ width: 18, height: 18, color: '#ef4444', flexShrink: 0, marginTop: 2 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p style={{ fontSize: 13, color: '#ef4444', fontWeight: 500, margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555555', marginBottom: 6 }}>
                Email Address
              </label>
              <input 
                type="email" 
                name="email"
                className="form-input w-full"
                placeholder="admin@jhansiprd.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid #dddddd',
                  borderRadius: 8,
                  color: '#333333',
                }}
                onFocus={(e) => e.target.style.borderColor = '#03D985'}
                onBlur={(e) => e.target.style.borderColor = '#dddddd'}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555555', marginBottom: 6 }}>
                Password
              </label>
              <input 
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input w-full pr-10"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid #dddddd',
                  borderRadius: 8,
                  color: '#333333',
                }}
                onFocus={(e) => e.target.style.borderColor = '#03D985'}
                onBlur={(e) => e.target.style.borderColor = '#dddddd'}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', right: 12, top: '1.85rem',
                  color: '#aaaaaa', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  outline: 'none' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#555555'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#aaaaaa'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: '#03D985', color: '#000000',
                fontWeight: 700, fontSize: 15, border: 'none',
                borderRadius: 8, padding: '12px 20px', 
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                marginTop: 8, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(3,217,133,0.25)',
                opacity: loading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if(!loading) e.currentTarget.style.background = '#02b870'
              }}
              onMouseLeave={(e) => {
                if(!loading) e.currentTarget.style.background = '#03D985'
              }}
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin" style={{ width: 18, height: 18, marginLeft: -4, marginRight: 8, color: '#000000' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}