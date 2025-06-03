const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const authenticateToken = require('../middleware/authMiddleware');

// POST /api/orders → Create a new order
router.post('/', authenticateToken, orderController.createOrder);
router.patch('/orders/:orderId/status', orderController.updateOrderStatus);
router.get('/orders/pending', orderController.getPendingOrders);

module.exports = router;
