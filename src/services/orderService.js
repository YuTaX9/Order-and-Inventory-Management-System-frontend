import api from './api';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const getMyOrders = async (statusFilter = '') => {
  const params = statusFilter ? `?status=${statusFilter}` : '';
  const response = await api.get(`/orders/my_orders/${params}`);
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}/`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.post(`/orders/${id}/cancel/`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/update_status/`, { status });
  return response.data;
};

export const getAllOrders = async (statusFilter = '') => {
  const params = statusFilter ? `?status=${statusFilter}` : '';
  const response = await api.get(`/orders/${params}`);
  return response.data;
};