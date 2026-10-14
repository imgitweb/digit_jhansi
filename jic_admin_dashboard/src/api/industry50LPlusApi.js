import axiosInstance from './axiosInstance';

export const getIndustries50L = async (params) => {
  const response = await axiosInstance.get('/industries-50lplus', { params });
  return response.data;
};

export const getIndustry50LById = async (id) => {
  const response = await axiosInstance.get(`/industries-50lplus/${id}`);
  return response.data;
};

export const createIndustry50L = async (data) => {
  const response = await axiosInstance.post('/industries-50lplus', data);
  return response.data;
};

export const updateIndustry50L = async (id, data) => {
  const response = await axiosInstance.put(`/industries-50lplus/${id}`, data);
  return response.data;
};

export const deleteIndustry50L = async (id) => {
  const response = await axiosInstance.delete(`/industries-50lplus/${id}`);
  return response.data;
};

export const uploadIndustry50LExcel = async (file) => {
  const formData = new FormData();
  formData.append('excelFile', file);
  
  const response = await axiosInstance.post('/ingestion/industries-50lplus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};