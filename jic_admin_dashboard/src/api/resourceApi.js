import axiosInstance from './axiosInstance';

export const getResources = async (params) => {
  const response = await axiosInstance.get('/resources', { params });
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await axiosInstance.get(`/resources/${id}`);
  return response.data;
};

export const createResource = async (data) => {
  const response = await axiosInstance.post('/resources', data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await axiosInstance.put(`/resources/${id}`, data);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await axiosInstance.delete(`/resources/${id}`);
  return response.data;
};

export const uploadResourceExcel = async (file) => {
  const formData = new FormData();
  formData.append('excelFile', file); // This matches backend upload.single('excelFile')
  
  // FIX: Explicitly enforcing multipart/form-data for this specific request
  const response = await axiosInstance.post('/ingestion/resources', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};