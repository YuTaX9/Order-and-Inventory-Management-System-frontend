import api from './api';

export const getAllProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice) params.append('min_price', filters.minPrice);
  if (filters.maxPrice) params.append('max_price', filters.maxPrice);
  if (filters.inStock) params.append('in_stock', 'true');
  if (filters.ordering) params.append('ordering', filters.ordering);
  
  const response = await api.get(`/products/?${params.toString()}`);
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}/`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products/', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}/`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}/`);
  return response.data;
};

export const updateStock = async (id, quantity) => {
  const response = await api.patch(`/products/${id}/update_stock/`, {
    stock_quantity: quantity
  });
  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await api.get('/products/low_stock/');
  return response.data;
};