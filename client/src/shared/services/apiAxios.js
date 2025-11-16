import api from '../../auth/authService';

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
