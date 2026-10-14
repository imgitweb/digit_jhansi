import axios from 'axios';

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'http://localhost:5000/api';
};

const axiosInstance = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // Update: Read from adminToken specifically for the admin panel
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// NEW: Response interceptor for automatic 401 (Unauthorized) handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the token is invalid/expired and we aren't already on the login page
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/login'; // Hard redirect to clear memory state
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;