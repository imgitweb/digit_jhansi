import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/industry50LPlusApi';

const initialFilters = {
  page: 1, limit: 10, search: '', city: '', district: '', 
  businessCategory: '', industryType: '', status: '', 
  ecommerceEnabled: '', gstRegistered: '', exportsCurrently: ''
};

export default function useIndustries50LPlus() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState(initialFilters);

  const fetchIndustries50L = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const res = await api.getIndustries50L(cleanFilters);
      
      if (res.success) {
        setData(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch industries. Check network or parameters.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchIndustries50L();
  }, [fetchIndustries50L]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return { 
    data, pagination, loading, error, filters, 
    updateFilter, fetchIndustries50L, resetFilters 
  };
}