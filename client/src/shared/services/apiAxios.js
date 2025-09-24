import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en API:", error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // GET
  get: async (url, config = {}) => {
    const response = await api.get(url, config);
    return response.data;
  },

  // POST
  post: async (url, data = {}, config = {}) => {
    const response = await api.post(url, data, config);
    return response.data;
  },

  // PUT
  put: async (url, data = {}, config = {}) => {
    const response = await api.put(url, data, config);
    return response.data;
  },

  // DELETE
  delete: async (url, config = {}) => {
    const response = await api.delete(url, config);
    return response.data;
  },
};
