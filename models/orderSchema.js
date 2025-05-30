const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      priceAtCheckout: { type: Number, required: true }, // snapshot at time of order
    }
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'upi', 'card'], required: true }, // ← ADD THIS LINE
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
  createdAt: { type: Date, default: Date.now },
  orderId : { type: String, unique: true, required: true }, // Unique order identifier
  discountPercentage: {type: Number, required: true, default: 0,},
discountAmount: {type: Number, required: true, default: 0,},
});

module.exports = mongoose.model('Order', orderSchema);
