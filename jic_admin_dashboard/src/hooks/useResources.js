import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/resourceApi';

const initialFilters = {
  page: 1, limit: 10, search: '', block: '', district: '', gender: '', 
  employmentStatus: '', status: '', primarySkill: '', availability: '', 
  digitalLiteracyLevel: '', willingToRelocate: ''
};

export default function useResources() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState(initialFilters);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Clean empty filters to prevent sending blank query params
      const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const res = await api.getResources(cleanFilters);
      
      if (res.success) {
        setData(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resources. Check network or text indexes.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return { 
    data, pagination, loading, error, filters, 
    updateFilter, fetchResources, resetFilters 
  };
}