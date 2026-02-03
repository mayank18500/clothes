const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');
require('dotenv').config();

const diagnose = async () => {
    try {
        await connectDB();
        const count = await Product.countDocuments();
        console.log(`MongoDB Product Count: ${count}`);

        if (count > 0) {
            const products = await Product.find().limit(1);
            console.log('Sample Product:', JSON.stringify(products[0], null, 2));
        }

        const fetch = (await import('node-fetch')).default;
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            console.log(`API Response Count: ${data.length}`);
            if (data.length > 0) {
                console.log('API Sample:', JSON.stringify(data[0], null, 2));
            }
        } catch (e) {
            console.error('API Fetch Error:', e.message);
        }

        process.exit();
    } catch (err) {
        console.error('Diagnosis Error:', err);
        process.exit(1);
    }
};

diagnose();
