import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://sistema-validacao.onrender.com/api';

const api = {
  async get(endpoint, params = {}) {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro na requisição GET:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição POST:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await axios.put(`${API_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição PUT:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const response = await axios.delete(`${API_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição DELETE:', error);
      throw error;
    }
  }
};

export default api;