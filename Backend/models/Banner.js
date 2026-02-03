const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: String,
    image: { type: String, required: true },
    cta: String,
    link: String,
    isActive: { type: Boolean, default: true },
    position: { type: Number, default: 0 },
    pages: [{ type: String }], // 'home', 'women', 'men', etc.
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', BannerSchema);
