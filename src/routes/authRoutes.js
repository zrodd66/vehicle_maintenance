const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Public routes (no authentication required)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes (require authentication)
router.use(verifyToken);
router.get('/me', AuthController.getCurrentUser);
router.put('/profile', AuthController.updateProfile);
router.put('/change-password', AuthController.changePassword);

// Admin only routes
router.use(requireRole('admin'));
// Add any admin-specific auth routes here

module.exports = router;
