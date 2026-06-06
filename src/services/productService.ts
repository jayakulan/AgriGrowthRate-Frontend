import api from '@/lib/axios';

export const productService = {
  getAll: async (params?: Record<string, string>) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getMyProducts: async (params?: Record<string, string>) => {
    const res = await api.get('/products/my', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  create: async (data: Record<string, any>) => {
    const res = await api.post('/products', data);
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
