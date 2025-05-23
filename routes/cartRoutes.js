const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authMiddleware');

// Protect all routes with auth
router.post('/add', authenticateToken, cartController.addToCart);
router.get('/', authenticateToken, cartController.getCart);
router.put('/reduce', authenticateToken, cartController.reduceFromCart);
router.delete('/remove', authenticateToken, cartController.removeFromCart);
router.delete('/clear', authenticateToken, cartController.clearCart);
router.get('/:productId', authenticateToken, cartController.getSingleCartItem);


module.exports = router;
