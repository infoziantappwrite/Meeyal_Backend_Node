// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', authenticateToken, userController.logoutUser);
router.get('/profile', authenticateToken, userController.getUserProfile);
router.post('/change-password', authenticateToken, userController.changePassword);


module.exports = router;
