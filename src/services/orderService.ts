import api from '@/lib/axios';

export interface OrderInput {
  items: {
    product: string;
    quantity: number;
  }[];
  paymentMethod?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export const orderService = {
  create: async (data: OrderInput) => {
    const res = await api.post('/orders', data);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get('/orders/my-orders');
    return res.data;
  },
  getFarmerOrders: async () => {
    const res = await api.get('/orders/farmer');
    return res.data;
  },
  updateStatus: async (orderId: string, status: string) => {
    const res = await api.put(`/orders/${orderId}/status`, { status });
    return res.data;
  },
  cancel: async (orderId: string) => {
    const res = await api.put(`/orders/${orderId}/cancel`);
    return res.data;
  }
};
