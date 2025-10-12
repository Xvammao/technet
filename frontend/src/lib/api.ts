import axios from 'axios';

// Detectar si estamos en ngrok o localhost
const getBaseURL = () => {
  // Si estamos en ngrok, construir la URL automáticamente
  if (window.location.hostname.includes('ngrok')) {
    // Usar el mismo dominio pero cambiar el subdominio
    // Por ejemplo: si estamos en abc123.ngrok-free.app
    // el backend estará en otro subdominio de ngrok
    const protocol = window.location.protocol; // https:
    
    // Opción 1: Usar una URL específica (CAMBIA ESTO CON TU URL DE DJANGO)
    return '�++https://68d80cce2993.ngrok-free.app';
    
    // Opción 2: Si usas el mismo túnel, descomentar:
    // return `${protocol}//${window.location.hostname}:8000`;
  }
  
  // Si hay una variable de entorno, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Por defecto, usar localhost
  return '�++https://32d9eea2fd69.ngrok-free.app';
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
