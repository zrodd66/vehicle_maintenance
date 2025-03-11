const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('./errorHandler');
const UserModel = require('../models/userModel');
const { jwtSecret } = require('../config/dotenvConfig');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      throw new UnauthorizedError('Token de autenticación no proporcionado');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Formato de token inválido');
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      
      // Get fresh user data from database
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        throw new UnauthorizedError('Usuario no encontrado');
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Token inválido');
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token expirado');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('No tienes permisos para realizar esta acción'));
    }

    next();
  };
};

// Middleware to check if user has access to specific resource
const checkResourceAccess = (resourceType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const resourceId = req.params.id;

      if (req.user.role === 'admin') {
        return next();
      }

      let hasAccess = false;

      switch (resourceType) {
        case 'vehicle':
          const vehicle = await VehicleModel.findById(resourceId);
          hasAccess = vehicle && vehicle.usuario_id === userId;
          break;

        case 'maintenance':
          const maintenance = await MaintenanceModel.findById(resourceId);
          hasAccess = maintenance && (
            maintenance.technician_id === userId || 
            maintenance.vehicle.usuario_id === userId
          );
          break;

        default:
          hasAccess = false;
      }

      if (!hasAccess) {
        throw new ForbiddenError('No tienes acceso a este recurso');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  verifyToken,
  requireRole,
  checkResourceAccess
};
