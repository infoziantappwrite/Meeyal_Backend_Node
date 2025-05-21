// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  details: { type: String, required: true },
  stock: { type: Number, required: true },
  discountPrice: { type: Number },
  originalPrice: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  status: { type: String, required: true },
  sold: { type: Number, default: 0 },
  productImages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductImage' }]
});

module.exports = mongoose.model('Product', productSchema);
