require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const clearData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB. Clearing products...');
        const result = await Product.deleteMany({});
        console.log(`Deleted ${result.deletedCount} products.`);
        console.log('Product database cleared!');
        process.exit();
    } catch (err) {
        console.error('Error clearing data:', err);
        process.exit(1);
    }
};

clearData();
