const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, async (req, res) => {
    try {
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        const recentOrders = await Order.find().populate('products.product').sort({ createdAt: -1 }).limit(5);

        const monthlySales = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } } // Sort by month
        ]);

        const formattedSales = monthlySales.map(item => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return { name: months[item._id - 1], total: item.total };
        });

        res.json({
            revenue: totalRevenue[0]?.total || 0,
            orders: totalOrders,
            products: totalProducts,
            users: totalUsers,
            recentOrders,
            graphData: formattedSales
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
