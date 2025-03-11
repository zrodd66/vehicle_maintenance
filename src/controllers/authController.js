const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { ValidationError, UnauthorizedError } = require('../middlewares/errorHandler');
const { jwtSecret, jwtExpiresIn } = require('../config/dotenvConfig');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        throw new ValidationError('Nombre, email y contraseña son requeridos');
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        throw new ValidationError('El email ya está registrado');
      }

      // Create new user
      const user = await UserModel.create({
        name,
        email,
        password,
        role: role || 'user'
      });

      // Generate token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        throw new ValidationError('Email y contraseña son requeridos');
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        throw new UnauthorizedError('Credenciales inválidas');
      }

      // Verify password
      const isValidPassword = await UserModel.validatePassword(user, password);
      if (!isValidPassword) {
        throw new UnauthorizedError('Credenciales inválidas');
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      
      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { name, email } = req.body;
      const userId = req.user.id;

      // Check if email is already taken
      if (email) {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          throw new ValidationError('El email ya está en uso');
        }
      }

      // Update user
      const updated = await UserModel.update(userId, { name, email });
      if (!updated) {
        throw new Error('Error al actualizar el perfil');
      }

      const user = await UserModel.findById(userId);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        throw new ValidationError('Contraseña actual y nueva son requeridas');
      }

      // Get user with password
      const user = await UserModel.findById(userId);

      // Verify current password
      const isValidPassword = await UserModel.validatePassword(user, currentPassword);
      if (!isValidPassword) {
        throw new UnauthorizedError('Contraseña actual incorrecta');
      }

      // Update password
      await UserModel.update(userId, { password: newPassword });

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
