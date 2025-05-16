const express = require('express');
const router = express.Router();

const userRoutes = require('./routes/userRoutes');

// Health/Test Route
router.get('/test', (req, res) => {
  res.status(200).json({ message: '✅ API is working fine!' });
});

// Mount user routes
router.use('/users', userRoutes);

module.exports = router;
