const MaintenanceModel = require('../models/maintenanceModel');
const VehicleModel = require('../models/vehicleModel');
const { ValidationError, NotFoundError, ForbiddenError } = require('../middlewares/errorHandler');

class MaintenanceController {
  static async getAllMaintenance(req, res, next) {
    try {
      let maintenanceRecords;

      // If user is technician, show only their maintenance records
      if (req.user.role === 'technician') {
        maintenanceRecords = await MaintenanceModel.findByTechnicianId(req.user.id);
      } 
      // If user is regular user, show maintenance for their vehicles
      else if (req.user.role === 'user') {
        const vehicles = await VehicleModel.findByUserId(req.user.id);
        const vehicleIds = vehicles.map(v => v.id);
        maintenanceRecords = [];
        for (const id of vehicleIds) {
          const records = await MaintenanceModel.findByVehicleId(id);
          maintenanceRecords.push(...records);
        }
      }
      // If admin, show all maintenance records
      else {
        maintenanceRecords = await MaintenanceModel.findAll();
      }

      res.json({
        success: true,
        data: maintenanceRecords
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMaintenanceById(req, res, next) {
    try {
      const maintenance = await MaintenanceModel.findById(req.params.id);
      
      if (!maintenance) {
        throw new NotFoundError('Registro de mantenimiento no encontrado');
      }

      // Check access rights
      if (req.user.role !== 'admin') {
        const vehicle = await VehicleModel.findById(maintenance.vehicle_id);
        const hasAccess = 
          req.user.role === 'technician' && maintenance.technician_id === req.user.id ||
          req.user.role === 'user' && vehicle.usuario_id === req.user.id;

        if (!hasAccess) {
          throw new ForbiddenError('No tienes acceso a este registro de mantenimiento');
        }
      }

      res.json({
        success: true,
        data: maintenance
      });
    } catch (error) {
      next(error);
    }
  }

  static async createMaintenance(req, res, next) {
    try {
      const {
        vehicle_id,
        type,
        description,
        cost,
        date,
        status = 'pending'
      } = req.body;

      // Validate required fields
      if (!vehicle_id || !type || !description || !cost || !date) {
        throw new ValidationError('Todos los campos son requeridos');
      }

      // Check if vehicle exists
      const vehicle = await VehicleModel.findById(vehicle_id);
      if (!vehicle) {
        throw new NotFoundError('Vehículo no encontrado');
      }

      // Create maintenance record
      const maintenance = await MaintenanceModel.create({
        vehicle_id,
        technician_id: req.user.role === 'technician' ? req.user.id : null,
        type,
        description,
        cost,
        date,
        status
      });

      // Update vehicle status if needed
      if (status === 'in_progress') {
        await VehicleModel.update(vehicle_id, { estado: 'maintenance' });
      }

      res.status(201).json({
        success: true,
        data: maintenance
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateMaintenance(req, res, next) {
    try {
      const maintenanceId = req.params.id;
      const updateData = req.body;

      // Check if maintenance record exists
      const maintenance = await MaintenanceModel.findById(maintenanceId);
      if (!maintenance) {
        throw new NotFoundError('Registro de mantenimiento no encontrado');
      }

      // Check access rights
      if (req.user.role !== 'admin' && 
          !(req.user.role === 'technician' && maintenance.technician_id === req.user.id)) {
        throw new ForbiddenError('No tienes permiso para actualizar este registro');
      }

      // Update maintenance
      const updated = await MaintenanceModel.update(maintenanceId, updateData);
      if (!updated) {
        throw new Error('Error al actualizar el registro de mantenimiento');
      }

      // If status changed to completed, update vehicle status
      if (updateData.status === 'completed') {
        await VehicleModel.update(maintenance.vehicle_id, { estado: 'active' });
      }

      const updatedMaintenance = await MaintenanceModel.findById(maintenanceId);

      res.json({
        success: true,
        data: updatedMaintenance
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMaintenance(req, res, next) {
    try {
      const maintenanceId = req.params.id;

      // Check if maintenance record exists
      const maintenance = await MaintenanceModel.findById(maintenanceId);
      if (!maintenance) {
        throw new NotFoundError('Registro de mantenimiento no encontrado');
      }

      // Only admin can delete maintenance records
      if (req.user.role !== 'admin') {
        throw new ForbiddenError('No tienes permiso para eliminar registros de mantenimiento');
      }

      // Delete maintenance record
      await MaintenanceModel.delete(maintenanceId);

      res.json({
        success: true,
        message: 'Registro de mantenimiento eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMaintenanceStats(req, res, next) {
    try {
      const stats = await MaintenanceModel.getMaintenanceStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MaintenanceController;
