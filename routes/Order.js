const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const updateOrderStatus  = require('../controllers/OrderController');
const getPendingOrders = require('../controllers/OrderController');
const authenticateToken = require('../middleware/authMiddleware');

// POST /api/orders → Create a new order
router.post('/', authenticateToken, orderController.createOrder);
router.patch('/orders/:orderId/status', updateOrderStatus);
router.get('/orders/pending', getPendingOrders);

module.exports = router;
