    import axiosInstance from './axiosInstance';

export const getInstitutions = async (params) => {
  const response = await axiosInstance.get('/institutions', { params });
  return response.data;
};

export const getInstitutionById = async (id) => {
  const response = await axiosInstance.get(`/institutions/${id}`);
  return response.data;
};

export const createInstitution = async (data) => {
  const response = await axiosInstance.post('/institutions', data);
  return response.data;
};

export const updateInstitution = async (id, data) => {
  const response = await axiosInstance.put(`/institutions/${id}`, data);
  return response.data;
};

export const deleteInstitution = async (id) => {
  const response = await axiosInstance.delete(`/institutions/${id}`);
  return response.data;
};

export const uploadInstitutionExcel = async (file) => {
  const formData = new FormData();
  formData.append('excelFile', file); 
  
  const response = await axiosInstance.post('/ingestion/institutions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};