const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { protect, admin } = require('../middleware/auth');

// Get all banners
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find().sort('position');
        res.json(banners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create banner (Admin)
router.post('/', protect, admin, async (req, res) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json(banner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update banner (Admin)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(banner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete banner (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Banner removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
