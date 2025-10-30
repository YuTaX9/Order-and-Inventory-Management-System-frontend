import api from './api';

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats/');
  return response.data;
};

export const getAllOrdersAdmin = async (statusFilter = '') => {
  const params = statusFilter ? `?status=${statusFilter}` : '';
  const response = await api.get(`/orders/${params}`);
  return response.data;
};