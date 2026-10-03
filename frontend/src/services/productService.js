import api from './api';

export const productService = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query = '', categoryId = '') => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (categoryId) params.append('categoryId', categoryId);
    const response = await api.get(`/products/search?${params.toString()}`);
    return response.data;
  },

  getLowStockProducts: async () => {
    const response = await api.get('/products/low-stock');
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
  },

  updateStock: async (id, stockData) => {
    const response = await api.patch(`/products/${id}/stock`, stockData);
    return response.data;
  },

  getProductStockHistory: async (id) => {
    const response = await api.get(`/products/${id}/stock-history`);
    return response.data;
  },
};

export default productService;
