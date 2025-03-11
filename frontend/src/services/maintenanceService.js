import api from './api';

const maintenanceService = {
  async getAllMaintenance() {
    try {
      const response = await api.get('/maintenance');
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getMaintenanceById(id) {
    try {
      const response = await api.get(`/maintenance/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createMaintenance(maintenanceData) {
    try {
      const response = await api.post('/maintenance', maintenanceData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateMaintenance(id, maintenanceData) {
    try {
      const response = await api.put(`/maintenance/${id}`, maintenanceData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteMaintenance(id) {
    try {
      const response = await api.delete(`/maintenance/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getMaintenanceStats() {
    try {
      const response = await api.get('/maintenance/stats');
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default maintenanceService; 