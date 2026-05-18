import api from '@/lib/axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'farmer' | 'consumer';
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const res = await api.post('/auth/login', payload);
    return res.data;
  },
  register: async (payload: RegisterPayload) => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('agri_token');
    localStorage.removeItem('agri_user');
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
