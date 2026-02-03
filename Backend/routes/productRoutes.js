const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const { protect, admin } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, isNew, isTrending } = req.query;
        let query = {};
        if (category) query.category = category;
        if (isNew === 'true') query.isNewArrival = true; // Note: Boolean conversion
        if (isTrending === 'true') query.isTrending = true;

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) {
            // Optional: fallback for _id if the id passed is a valid ObjectId
            // const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
            // if (isValidObjectId) {
            //     const productById = await Product.findById(req.params.id);
            //     if (productById) return res.json(productById);
            // }
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Product (Admin)
router.post('/', protect, admin, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Product (Admin)
router.patch('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Product (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
