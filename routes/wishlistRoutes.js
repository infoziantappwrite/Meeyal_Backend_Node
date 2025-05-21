const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Add to wishlist
router.post('/', wishlistController.addToWishlist);

// Get wishlist by user ID
router.get('/:userId', wishlistController.getWishlist);

// Remove from wishlist
router.delete('/', wishlistController.removeFromWishlist);

module.exports = router;




// http://localhost:8000/api/wishlist/
