import axiosInstance from './axiosInstance';

export const getRiders = async (params) => {
  const response = await axiosInstance.get('/riders', { params });
  return response.data;
};

export const getRiderById = async (id) => {
  const response = await axiosInstance.get(`/riders/${id}`);
  return response.data;
};

export const createRider = async (data) => {
  const response = await axiosInstance.post('/riders', data);
  return response.data;
};

export const updateRider = async (id, data) => {
  const response = await axiosInstance.put(`/riders/${id}`, data);
  return response.data;
};

export const deleteRider = async (id) => {
  const response = await axiosInstance.delete(`/riders/${id}`);
  return response.data;
};

export const uploadRiderExcel = async (file) => {
  const formData = new FormData();
  formData.append('excelFile', file); 
  
  const response = await axiosInstance.post('/ingestion/riders', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};