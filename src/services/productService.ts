import api from '@/lib/axios';

export const productService = {
  getAll: async (params?: Record<string, string>) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  create: async (formData: FormData) => {
    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  update: async (id: string, data: Record<string, unknown>) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};
