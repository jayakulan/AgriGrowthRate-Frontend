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
  phone?: string;
  otp?: string;
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
  sendOtp: async (phone: string, email: string) => {
    const res = await api.post('/auth/send-otp', { phone, email });
    return res.data;
  },
  googleLogin: async (payload: { credential?: string; accessToken?: string }) => {
    const res = await api.post('/auth/google', payload);
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
