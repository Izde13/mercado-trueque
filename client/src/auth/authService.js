import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', {
      email: userData.email,
      nombre: userData.nombre,
      apellido: userData.apellido,
      contrasena: userData.contrasena,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Login de usuario
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      contrasena: credentials.password || credentials.contrasena,
    });
    
    // Guardar token y usuario en localStorage
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Obtener usuario autenticado
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Logout de usuario
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Verificar si el usuario tiene un rol específico
export const hasRole = (rol) => {
  const user = getCurrentUser();
  return user?.rol === rol || (user?.roles && user.roles.includes(rol));
};

// Verificar si el usuario tiene alguno de los roles especificados
export const hasAnyRole = (roles) => {
  const user = getCurrentUser();
  if (!user) return false;
  return roles.some(rol => user?.rol === rol || (user?.roles && user.roles.includes(rol)));
};

// Obtener el token
export const getToken = () => {
  return localStorage.getItem('token');
};

export default api;
