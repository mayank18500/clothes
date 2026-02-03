const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    subcategory: { type: String },
    description: { type: String },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{
        name: String,
        hex: String
    }],
    isNewArrival: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', ProductSchema);
