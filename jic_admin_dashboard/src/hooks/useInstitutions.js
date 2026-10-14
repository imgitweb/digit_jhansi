import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/institutionApi';

const initialFilters = {
  page: 1, limit: 10, search: '',
  institutionType: '', affiliation: '', status: ''
};

export default function useInstitutions() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState(initialFilters);

  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const res = await api.getInstitutions(cleanFilters);
      
      if (res.success) {
        setData(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch institutions. Check network or parameters.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return { 
    data, pagination, loading, error, filters, 
    updateFilter, fetchInstitutions, resetFilters 
  };
}