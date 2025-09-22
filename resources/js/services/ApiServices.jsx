// resources/js/Services/ApiService.js
import axios from 'axios';

// Get CSRF token for Laravel
const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.content;

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrfToken,
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export const apiService = {
  // Pengadaan endpoints
  async getPengadaanData() {
    try {
      const response = await apiClient.get('/pengadaan');
      return response.data;
    } catch (error) {
      console.error('Error fetching pengadaan data:', error);
      throw error;
    }
  },

  async createPengadaan(data) {
    try {
      const response = await apiClient.post('/pengadaan', data);
      return response.data;
    } catch (error) {
      console.error('Error creating pengadaan:', error);
      throw error;
    }
  },

  async updatePengadaan(id, data) {
    try {
      const response = await apiClient.put(`/pengadaan/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating pengadaan:', error);
      throw error;
    }
  },

  async deletePengadaan(id) {
    try {
      await apiClient.delete(`/pengadaan/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting pengadaan:', error);
      throw error;
    }
  },

  // Amandemen endpoints
  async getAmandemenData() {
    try {
      const response = await apiClient.get('/amandemen');
      return response.data;
    } catch (error) {
      console.error('Error fetching amandemen data:', error);
      throw error;
    }
  },

  async createAmandemen(data) {
    try {
      const response = await apiClient.post('/amandemen', data);
      return response.data;
    } catch (error) {
      console.error('Error creating amandemen:', error);
      throw error;
    }
  },

  async updateAmandemen(id, data) {
    try {
      const response = await apiClient.put(`/amandemen/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating amandemen:', error);
      throw error;
    }
  },

  async deleteAmandemen(id) {
    try {
      await apiClient.delete(`/amandemen/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting amandemen:', error);
      throw error;
    }
  }
};
