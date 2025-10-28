import api from './api';

export const getAllCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}/`);
  return response.data;
};

export const getCategoryProducts = async (id) => {
  const response = await api.get(`/categories/${id}/products/`);
  return response.data;
};