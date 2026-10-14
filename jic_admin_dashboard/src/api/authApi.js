import axiosInstance from './axiosInstance';

export const loginAdmin = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const logoutAdmin = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

export const changePassword = async (data) => {
  const response = await axiosInstance.put('/auth/change-password', data);
  return response.data;
};