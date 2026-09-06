import api from '@/lib/axios';

export interface ContactMessageInput {
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  message: string;
}

export const contactService = {
  submitContactMessage: async (data: ContactMessageInput) => {
    const res = await api.post('/contact', data);
    return res.data;
  },
};
