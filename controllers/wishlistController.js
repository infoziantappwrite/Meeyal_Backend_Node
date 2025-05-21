const Wishlist = require('../models/wishlist');

// Add to wishlist (POST)
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();

    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error });
  }
};

// Get wishlist by user (GET)
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.find({ userId }).populate('productId'); // optional populate
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};

// Remove from wishlist (DELETE)
exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const result = await Wishlist.findOneAndDelete({ userId, productId });
    if (!result) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item', error });
  }
};
