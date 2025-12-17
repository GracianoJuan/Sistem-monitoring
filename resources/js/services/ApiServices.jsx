import axios from 'axios';
// Using server-side session cookie for auth; no supabase client here

// Safely get CSRF token with fallback
const getCsrfToken = () => {
  const meta = document.head.querySelector('meta[name="csrf-token"]');
  return meta?.getAttribute('content') || '';
};

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': getCsrfToken(),
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// No auth interceptor required because server uses HttpOnly session cookie

// Attach Authorization header from localStorage fallback (when cookie not sent)
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Add response interceptor for debugging and auth error handling
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`Response from ${response.config.url}:`, response.status);
    }
    return response;
  },
  async (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      console.warn('Unauthorized request - user may need to login again');
      // Optionally trigger a logout or redirect
    }

    return Promise.reject(error);
  }
);

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
      const response = await apiClient.delete(`/pengadaan/${id}`);
      return response.data || { success: true, message: 'Deleted successfully' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Failed to delete pengadaan: ${errorMessage}`);
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
      const response = await apiClient.delete(`/amandemen/${id}`);
      return response.data || { success: true, message: 'Deleted successfully' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Failed to delete amandemen: ${errorMessage}`);
    }
  },

  // Stats endpoint
  async getStats() {
    try {
      const response = await apiClient.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error processing the statistic:', error);
      throw error;
    }
  },

  // User Management endpoints (Admin only)
  // These should be proxied through your backend API, not called directly
  async getAllUsers() {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getUser(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async updateUserRole(userId, newRole) {
    try {
      const response = await apiClient.put(`/users/${userId}/role`, 
        { role: newRole }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async getSummary(){
    try {
      const response = await apiClient.get('/datasum');
      // console.log(response.data.charts)
      return response.data;
    } catch (error) {
      console.error('Error fetching the data');
      throw error;
    }
  }
};

export { apiClient };