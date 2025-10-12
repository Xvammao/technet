import axios from 'axios';

// Detectar la URL del backend
const getBaseURL = () => {
  // Si estamos accediendo desde ngrok
  if (window.location.hostname.includes('ngrok')) {
    // Esta URL será reemplazada por el script
    return 'http://localhost:8000';
  }
  
  // Por defecto, usar localhost
  return 'http://localhost:8000';
};

const api = axios.create({
  baseURL: getBaseURL() + '/technet',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

// Helper function to logout
export const logout = (): void => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

// API endpoints
export const endpoints = {
  acometidas: '/acometidas/',
  descuentos: '/descuentos/',
  dr: '/dr/',
  instalaciones: '/instalaciones/',
  operadores: '/operadores/',
  productos: '/productos/',
  tecnicos: '/tecnicos/',
  tipodeordenes: '/tipodeordenes/',
};
