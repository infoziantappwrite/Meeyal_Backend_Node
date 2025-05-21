const mongoose = require('mongoose');
const { Schema } = mongoose;

const wishlistSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId, // use String if not referencing another collection
        ref: 'Product', // optional: only if it's a referenced collection
        required: true
    }
}, { timestamps: true });

// Prevent duplicates per user-product pair
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
