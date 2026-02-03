const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');
const fs = require('fs');
require('dotenv').config();

const dump = async () => {
    try {
        await connectDB();
        const products = await Product.find({});
        fs.writeFileSync('db_dump.json', JSON.stringify(products, null, 2));
        console.log(`Dumped ${products.length} products to db_dump.json`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

dump();
