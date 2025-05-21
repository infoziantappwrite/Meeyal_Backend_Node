const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authenticateToken = require('../middleware/authMiddleware');

// Add to wishlist
router.post('/', authenticateToken, wishlistController.addToWishlist);

// Get wishlist by user ID
router.get('/',authenticateToken, wishlistController.getWishlist);

// Remove from wishlist
router.delete('/', authenticateToken,wishlistController.removeFromWishlist);

module.exports = router;




// http://localhost:8000/api/wishlist/
