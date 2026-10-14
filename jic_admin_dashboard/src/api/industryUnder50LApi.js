import axiosInstance from './axiosInstance';

export const getIndustries = async (params) => {
  const response = await axiosInstance.get('/industries-under50l', { params });
  return response.data;
};

export const getIndustryById = async (id) => {
  const response = await axiosInstance.get(`/industries-under50l/${id}`);
  return response.data;
};

export const createIndustry = async (data) => {
  const response = await axiosInstance.post('/industries-under50l', data);
  return response.data;
};

export const updateIndustry = async (id, data) => {
  const response = await axiosInstance.put(`/industries-under50l/${id}`, data);
  return response.data;
};

export const deleteIndustry = async (id) => {
  const response = await axiosInstance.delete(`/industries-under50l/${id}`);
  return response.data;
};

export const uploadIndustryExcel = async (file) => {
  const formData = new FormData();
  formData.append('excelFile', file);
  
  const response = await axiosInstance.post('/ingestion/industries-under50l', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};