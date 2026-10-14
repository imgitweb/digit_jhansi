import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginAdmin, logoutAdmin, getMe } from '../api/authApi';
import { useAppToast } from '../hooks/useAppToast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const toast = useAppToast();
  const [state, setState] = useState({
    admin: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // true on initial app load while checking stored auth
  });

  const refreshAdmin = useCallback(async () => {
    const storedToken = localStorage.getItem('adminToken');
    const storedAdmin = localStorage.getItem('adminData');

    if (storedToken && storedAdmin) {
      try {
        // Optimistic UI update
        setState(prev => ({ 
          ...prev, 
          token: storedToken, 
          admin: JSON.parse(storedAdmin), 
          isAuthenticated: true 
        }));
        
        // Verify with server
        const res = await getMe();
        if (res.success) {
          setState(prev => ({ ...prev, admin: res.data }));
          localStorage.setItem('adminData', JSON.stringify(res.data));
        }
      } catch (err) {
        // Token is invalid or expired
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        setState({ admin: null, token: null, isAuthenticated: false, isLoading: false });
      }
    }
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  const login = async (email, password) => {
    try {
      const res = await loginAdmin({ email, password });
      if (res.success) {
        const { token, admin } = res.data;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminData', JSON.stringify(admin));
        setState({ admin, token, isAuthenticated: true, isLoading: false });
        toast.success(`Welcome back, ${admin.name}!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
      throw err;
    }
  };

  const logout = async () => {
    try { 
      await logoutAdmin(); 
      toast.success('Logged out successfully');
    } catch (e) {
      toast.error('Logout failed. Please try again.');
    }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setState({ admin: null, token: null, isAuthenticated: false, isLoading: false });
  };

  const updateAdminData = (newData) => {
    setState(prev => ({ ...prev, admin: newData }));
    localStorage.setItem('adminData', JSON.stringify(newData));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshAdmin, updateAdminData }}>
      {children}
    </AuthContext.Provider>
  );
};