import api from './api';

export const stockService = {
  getRecentHistory: async (limit = 15) => {
    const response = await api.get(`/stock-history?limit=${limit}`);
    return response.data;
  },

  getAllHistory: async () => {
    const response = await api.get('/stock-history/all');
    return response.data;
  },
};

export default stockService;
