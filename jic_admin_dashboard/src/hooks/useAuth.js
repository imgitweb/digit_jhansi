import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const isAdmin = context.admin?.role === 'admin' || context.admin?.role === 'superadmin';
  const isSuperAdmin = context.admin?.role === 'superadmin';

  return { ...context, isAdmin, isSuperAdmin };
};