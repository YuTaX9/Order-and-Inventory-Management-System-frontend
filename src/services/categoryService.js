import api from './api';

export const getAllCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

// Get single category
export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}/`);
  return response.data;
};

export const getCategoryProducts = async (id) => {
  const response = await api.get(`/categories/${id}/products/`);
  return response.data;
};

// Create new category (Admin only)
export const createCategory = async (categoryData) => {
  const response = await api.post('/categories/', categoryData);
  return response.data;
};

// Update category (Admin only)
export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}/`, categoryData);
  return response.data;
};

// Delete category (Admin only)
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}/`);
  return response.data;
};