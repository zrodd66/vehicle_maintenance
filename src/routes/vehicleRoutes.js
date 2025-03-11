const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicleController');
const { verifyToken, requireRole, checkResourceAccess } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Get vehicle statistics
router.get('/stats', VehicleController.getVehicleStats);

// Get all vehicles (filtered by user role)
router.get('/', VehicleController.getAllVehicles);

// Create new vehicle
router.post('/', VehicleController.createVehicle);

// Routes that require specific vehicle access
router.get('/:id', checkResourceAccess('vehicle'), VehicleController.getVehicleById);
router.put('/:id', checkResourceAccess('vehicle'), VehicleController.updateVehicle);
router.delete('/:id', checkResourceAccess('vehicle'), VehicleController.deleteVehicle);

// Get vehicle maintenance history
router.get('/:id/maintenance', checkResourceAccess('vehicle'), VehicleController.getVehicleMaintenanceHistory);

// Admin only routes
router.use(requireRole('admin'));

// Add any admin-specific vehicle routes here

module.exports = router;
