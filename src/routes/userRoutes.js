const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin, isOwnerOrAdmin } = require('../middlewares/authMiddleware');

// User routes
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.get('/:id', verifyToken, isOwnerOrAdmin, userController.getUserById);
router.post('/', verifyToken, isAdmin, userController.createUser);
router.put('/:id', verifyToken, isOwnerOrAdmin, userController.updateUser);
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
