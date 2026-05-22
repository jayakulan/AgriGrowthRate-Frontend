import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('agri_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — token expired or invalid
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/auth/login') || 
                          error.config?.url?.includes('/auth/register') || 
                          error.config?.url?.includes('/auth/google');
                          
    if (error.response?.status === 401 && !isAuthRequest && typeof window !== 'undefined') {
      localStorage.removeItem('agri_token');
      localStorage.removeItem('agri_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
