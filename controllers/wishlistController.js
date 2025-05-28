const Wishlist = require('../models/wishlist');
const Product = require('../models/Product'); // Needed for populate to work
const mongoose = require('mongoose');

// ✅ Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Must be extracted from auth middleware
    const { productId } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Check for existing item
    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();

    res.status(201).json({ message: 'Added to wishlist', wishlistItem });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

// ✅ Get wishlist for logged-in user
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({ userId })
  .populate({
    path: 'productId',
    populate: {
      path: 'productImages',
      model: 'ProductImage'
    }
  });
    
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

// ✅ Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { wishlistId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
      return res.status(400).json({ message: 'Invalid wishlist ID' });
    }

    const result = await Wishlist.findOneAndDelete({ userId, _id: wishlistId });
    if (!result) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing item', error: error.message });
  }
};
