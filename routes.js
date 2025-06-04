const express = require('express');
const router = express.Router();
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');
const subcategories = require('./routes/subCategoryRoutes');
const orderRoutes = require('./routes/Order');
const addressRoutes = require('./routes/addressRoutes'); // Assuming you have this route

const userRoutes = require('./routes/userRoutes');

// Health/Test Route
router.get('/test', (req, res) => {
  res.status(200).json({ message: '✅ API is working fine!' });
});

// Mount user routes
router.use('/users', userRoutes);
router.use('/api/wishlist', wishlistRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/subcategory', subcategories); // ✅ correct
router.use('/api/orders', orderRoutes);
router.use('/api/addresses', addressRoutes)


module.exports = router;
