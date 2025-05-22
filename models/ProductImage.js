// models/ProductImage.js
const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('ProductImage', productImageSchema);
