import api from './api';

export const vehicleService = {
  async getAllVehicles() {
    try {
      const response = await api.get('/vehicles');
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getVehicleById(id) {
    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createVehicle(vehicleData) {
    try {
      const response = await api.post('/vehicles', vehicleData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateVehicle(id, vehicleData) {
    try {
      const response = await api.put(`/vehicles/${id}`, vehicleData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteVehicle(id) {
    try {
      const response = await api.delete(`/vehicles/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getVehicleMaintenance(id) {
    try {
      const response = await api.get(`/vehicles/${id}/maintenance`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default vehicleService;
