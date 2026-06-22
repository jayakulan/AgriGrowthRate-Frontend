import api from '@/lib/axios';

export interface FeedbackInput {
  orderId: string;
  rating: number;
  comment: string;
}

export const feedbackService = {
  submitFeedback: async (data: FeedbackInput) => {
    const res = await api.post('/feedback', data);
    return res.data;
  }
};
