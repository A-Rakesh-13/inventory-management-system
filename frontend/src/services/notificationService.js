import api from './api';

export const notificationService = {
  subscribe: async (productId, email) => {
    const response = await api.post('/notifications', { productId, email });
    return response.data;
  },
};

export default notificationService;
