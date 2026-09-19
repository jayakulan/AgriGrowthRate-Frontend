import axios from 'axios';

const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Send cookies with all requests
});

// A clean instance specifically for token refreshes to avoid interceptor recursion
const refreshApi = axios.create({
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      config.baseURL = 'http://localhost:5001/api';
    } else {
      config.baseURL = `${window.location.protocol}//${window.location.host}/api`;
    }
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    config.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  }
  return config;
});

refreshApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      config.baseURL = 'http://localhost:5001/api';
    } else {
      config.baseURL = `${window.location.protocol}//${window.location.host}/api`;
    }
  } else {
    config.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  }
  return config;
});

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Handle 401 — token expired or invalid, trigger silent refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest?.url?.includes('/auth/login') || 
                          originalRequest?.url?.includes('/auth/register') || 
                          originalRequest?.url?.includes('/auth/google') ||
                          originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshApi.post('/auth/refresh');
        if (typeof window !== 'undefined' && response.data.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        processQueue(null);
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('agri_user');
          if (window.location.pathname.startsWith('/dashboard')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
