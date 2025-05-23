const Cart = require('../models/cart');
const Product = require('../models/Product');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const ProductImage = require('../models/ProductImage');
const mongoose = require('mongoose');

// ✅ Add to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const existing = await Cart.findOne({ userId, productId });
    if (existing) {
      // If item already in cart, update quantity
      existing.quantity += quantity;
      await existing.save();
      return res.status(200).json({ message: 'Cart updated', cartItem: existing });
    }

    const cartItem = new Cart({ userId, productId, quantity });
    await cartItem.save();

    res.status(201).json({ message: 'Item added to cart', cartItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

exports.reduceFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const existing = await Cart.findOne({ userId, productId });

    if (!existing) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (existing.quantity <= quantity) {
      // If the quantity goes to 0 or less, remove the item entirely
      await existing.deleteOne();
      return res.status(200).json({ message: 'Item removed from cart' });
    }

    existing.quantity -= quantity;
    await existing.save();

    res.status(200).json({ message: 'Cart quantity reduced', cartItem: existing });
  } catch (error) {
    console.error('Error reducing from cart:', error);
    res.status(500).json({ message: 'Error reducing item quantity', error: error.message });
  }
};

// ✅ Get all cart items for a user
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ userId }).populate({
        path: 'productId',
        populate: [
          { path: 'category' },
          { path: 'subCategory' },
          { path: 'productImages' }
        ]
      });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// ✅ Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const result = await Cart.findOneAndDelete({ userId, productId });
    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing item', error: error.message });
  }
};


exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.deleteMany({ userId });

    res.status(200).json({ message: 'All cart items removed' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};
exports.getSingleCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const item = await Cart.findOne({ userId, productId }).populate({
      path: 'productId',
      populate: [
        { path: 'category' },
        { path: 'subCategory' },
        { path: 'productImages' }
      ]
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching single cart item:", error);
    res.status(500).json({ message: 'Server error' });
  }
};