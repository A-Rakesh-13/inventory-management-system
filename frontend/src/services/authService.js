import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('stockcheck_token', response.data.token);
      localStorage.setItem('stockcheck_user', JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      }));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('stockcheck_token');
    localStorage.removeItem('stockcheck_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('stockcheck_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('stockcheck_token');
  },
};

export default authService;
