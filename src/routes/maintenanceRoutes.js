const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/maintenanceController');
const { verifyToken, requireRole, checkResourceAccess } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Get maintenance statistics (available to all authenticated users)
router.get('/stats', MaintenanceController.getMaintenanceStats);

// Get all maintenance records (filtered by user role)
router.get('/', MaintenanceController.getAllMaintenance);

// Create new maintenance record (available to technicians and admins)
router.post('/', requireRole('admin', 'technician'), MaintenanceController.createMaintenance);

// Routes that require specific maintenance record access
router.get('/:id', checkResourceAccess('maintenance'), MaintenanceController.getMaintenanceById);
router.put('/:id', requireRole('admin', 'technician'), checkResourceAccess('maintenance'), MaintenanceController.updateMaintenance);

// Admin only routes
router.delete('/:id', requireRole('admin'), MaintenanceController.deleteMaintenance);

module.exports = router;
