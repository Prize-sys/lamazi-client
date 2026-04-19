import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('mc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mc_token');
      localStorage.removeItem('mc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const therapistAPI = {
  list: (params) => api.get('/therapists', { params }),
  get: (id) => api.get(`/therapists/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  list: (params) => api.get('/bookings', { params }),
  get: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  review: (id, data) => api.post(`/bookings/${id}/review`, data),
};

export const paymentAPI = {
  initiateMpesa: (data) => api.post('/payments/mpesa/initiate', data),
  simulate: (bookingId) => api.post(`/payments/simulate/${bookingId}`),
};

export default api;
