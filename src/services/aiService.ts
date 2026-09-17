import api from '@/lib/axios';

export const aiService = {
  detectDisease: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/ai/detect-disease', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getRecommendations: async (cropType: string, location: string, season: string) => {
    const res = await api.post('/ai/recommend', { cropType, location, season });
    return res.data;
  },
  getWeatherAdvisory: async (lat: number, lon: number) => {
    const res = await api.get('/ai/weather-advisory', { params: { lat, lon } });
    return res.data;
  },
  chat: async (messages: { role: string; content: string }[]) => {
    const res = await api.post('/ai/chat', { messages });
    return res.data;
  },
};
