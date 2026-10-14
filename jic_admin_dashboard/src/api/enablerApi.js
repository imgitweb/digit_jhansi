import axiosInstance from './axiosInstance';

export const getEnablers = async (params) => {
  const response = await axiosInstance.get('/enablers', { params });
  return response.data;
};

export const getEnablerById = async (id) => {
  const response = await axiosInstance.get(`/enablers/${id}`);
  return response.data;
};

export const createEnabler = async (data) => {
  const response = await axiosInstance.post('/enablers', data);
  return response.data;
};

export const updateEnabler = async (id, data) => {
  const response = await axiosInstance.put(`/enablers/${id}`, data);
  return response.data;
};

export const deleteEnabler = async (id) => {
  const response = await axiosInstance.delete(`/enablers/${id}`);
  return response.data;
};

export const uploadEnablerExcel = async (file) => {
  const formData = new FormData();
  formData.append('excelFile', file);
  
  const response = await axiosInstance.post('/ingestion/enablers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};