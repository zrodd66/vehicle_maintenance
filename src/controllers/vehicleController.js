const VehicleModel = require('../models/vehicleModel');
const MaintenanceModel = require('../models/maintenanceModel');
const { ValidationError, NotFoundError } = require('../middlewares/errorHandler');

class VehicleController {
  static async getAllVehicles(req, res, next) {
    try {
      let vehicles;
      
      // If user is not admin, only show their vehicles
      if (req.user.role !== 'admin') {
        vehicles = await VehicleModel.findByUserId(req.user.id);
      } else {
        vehicles = await VehicleModel.findAll();
      }

      // Ensure we always return an array
      vehicles = vehicles || [];

      res.json({
        success: true,
        data: vehicles.map(vehicle => ({
          id: vehicle.id,
          make: vehicle.marca,
          model: vehicle.modelo,
          year: vehicle.año,
          plate: vehicle.placa,
          status: vehicle.estado,
          userId: vehicle.usuario_id
        }))
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVehicleById(req, res, next) {
    try {
      const vehicle = await VehicleModel.findById(req.params.id);
      
      if (!vehicle) {
        throw new NotFoundError('Vehículo no encontrado');
      }

      // Check if user has access to this vehicle
      if (req.user.role !== 'admin' && vehicle.usuario_id !== req.user.id) {
        throw new ForbiddenError('No tienes acceso a este vehículo');
      }

      res.json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      next(error);
    }
  }

  static async createVehicle(req, res, next) {
    try {
      const { modelo, marca, año, placa, estado } = req.body;

      // Validate required fields
      if (!modelo || !marca || !año || !placa) {
        throw new ValidationError('Todos los campos son requeridos');
      }

      // Create vehicle
      const vehicle = await VehicleModel.create({
        modelo,
        marca,
        año,
        placa,
        estado: estado || 'activo',
        usuario_id: req.user.id
      });

      res.status(201).json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateVehicle(req, res, next) {
    try {
      const vehicleId = req.params.id;
      const updateData = req.body;

      // Check if vehicle exists
      const vehicle = await VehicleModel.findById(vehicleId);
      if (!vehicle) {
        throw new NotFoundError('Vehículo no encontrado');
      }

      // Check if user has access to this vehicle
      if (req.user.role !== 'admin' && vehicle.usuario_id !== req.user.id) {
        throw new ForbiddenError('No tienes permiso para actualizar este vehículo');
      }

      // Update vehicle
      const updated = await VehicleModel.update(vehicleId, updateData);
      if (!updated) {
        throw new Error('Error al actualizar el vehículo');
      }

      const updatedVehicle = await VehicleModel.findById(vehicleId);

      res.json({
        success: true,
        data: updatedVehicle
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteVehicle(req, res, next) {
    try {
      const vehicleId = req.params.id;

      // Check if vehicle exists
      const vehicle = await VehicleModel.findById(vehicleId);
      if (!vehicle) {
        throw new NotFoundError('Vehículo no encontrado');
      }

      // Check if user has access to this vehicle
      if (req.user.role !== 'admin' && vehicle.usuario_id !== req.user.id) {
        throw new ForbiddenError('No tienes permiso para eliminar este vehículo');
      }

      // Delete vehicle
      await VehicleModel.delete(vehicleId);

      res.json({
        success: true,
        message: 'Vehículo eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVehicleMaintenanceHistory(req, res, next) {
    try {
      const vehicleId = req.params.id;

      // Check if vehicle exists
      const vehicle = await VehicleModel.findById(vehicleId);
      if (!vehicle) {
        throw new NotFoundError('Vehículo no encontrado');
      }

      // Check if user has access to this vehicle
      if (req.user.role !== 'admin' && vehicle.usuario_id !== req.user.id) {
        throw new ForbiddenError('No tienes acceso al historial de este vehículo');
      }

      // Get maintenance history
      const maintenanceHistory = await VehicleModel.getMaintenanceHistory(vehicleId);

      res.json({
        success: true,
        data: {
          vehicle,
          maintenanceHistory
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVehicleStats(req, res, next) {
    try {
      let vehicles;
      let stats = {
        total: 0,
        active: 0,
        maintenance: 0,
        inactive: 0
      };

      // Get vehicles based on user role
      if (req.user.role !== 'admin') {
        vehicles = await VehicleModel.findByUserId(req.user.id);
      } else {
        vehicles = await VehicleModel.findAll();
      }

      // Calculate stats
      vehicles.forEach(vehicle => {
        stats.total++;
        stats[vehicle.estado.toLowerCase()]++;
      });

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VehicleController;
