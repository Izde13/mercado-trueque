import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/auth';

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (credentials) => {
  return await axios.post(`${API_URL}/login`, credentials);
};
