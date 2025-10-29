import api from './api';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const register = async (userData) => {
  const response = await api.post('/auth/register/', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);
  if (response.data.access && response.data.refresh) {
    localStorage.setItem('access', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile/');
  return response.data;
};

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) throw new Error('No refresh access found');

  try {
    const res = await axios.post(`${BASE_URL}/auth/access/refresh/`, { refresh });
    localStorage.setItem('access', res.data.access);
    return res.data.access;
  } catch (error) {
    console.error('Refresh access failed:', error.response?.data || error.message);
    logout();
    throw error;
  }
};
