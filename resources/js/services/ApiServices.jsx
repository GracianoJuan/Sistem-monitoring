import axios from 'axios';

const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.content;

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrfToken,
    'X-Requested-With': 'XMLHttpRequest',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const apiService = {
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
      console.log(`Attempting to delete pengadaan with ID: ${id}`);
      const response = await apiClient.delete(`/pengadaan/${id}`);
      console.log('Delete pengadaan successful:', response.status, response.data);
      
      return response.data || { success: true, message: 'Deleted successfully' };
    } catch (error) {
      console.error('Error deleting pengadaan:', {
        id,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      throw new Error(`Failed to delete pengadaan (ID: ${id}): ${errorMessage}`);
    }
  },


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
      console.log(`Attempting to delete amandemen with ID: ${id}`);
      const response = await apiClient.delete(`/amandemen/${id}`);
      console.log('Delete amandemen successful:', response.status, response.data);
      
      return response.data || { success: true, message: 'Deleted successfully' };
    } catch (error) {
      console.error('Error deleting amandemen:', {
        id,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      throw new Error(`Failed to delete amandemen (ID: ${id}): ${errorMessage}`);
    }
  }
};