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
  farmerCardNo?: string;
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const res = await api.post('/auth/login', payload);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
    }
    return res.data;
  },
  register: async (payload: RegisterPayload) => {
    const res = await api.post('/auth/register', payload);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
    }
    return res.data;
  },
  sendOtp: async (phone: string, email: string) => {
    const res = await api.post('/auth/send-otp', { phone, email });
    return res.data;
  },
  googleLogin: async (payload: { credential?: string; accessToken?: string; role?: string }) => {
    const res = await api.post('/auth/google', payload);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
    }
    return res.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Error logging out on backend:', err);
    } finally {
      localStorage.removeItem('agri_user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  refresh: async () => {
    const res = await api.post('/auth/refresh');
    return res.data;
  },
};
