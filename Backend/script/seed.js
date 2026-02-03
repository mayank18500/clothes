require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');


const products = [
    {
        id: '1',
        name: 'Silk Blend Blazer',
        price: 289,
        category: 'women',
        subcategory: 'blazers',
        description: 'A beautifully tailored silk blend blazer with a relaxed fit. Perfect for both office and evening wear. Features notched lapels and a single-button closure.',
        images: ['/assets/product-1.jpg', '/assets/product-1.jpg'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Ivory', hex: '#F5F5DC' },
            { name: 'Charcoal', hex: '#36454F' },
            { name: 'Camel', hex: '#C19A6B' },
        ],
        isNewArrival: true,
        isTrending: true,
        inStock: true,
        stock: 50,
    },
    {
        id: '2',
        name: 'Cashmere Crew Neck',
        price: 195,
        category: 'women',
        subcategory: 'knitwear',
        description: 'Luxuriously soft pure cashmere sweater with a classic crew neck. Lightweight yet warm, perfect for layering.',
        images: ['/assets/product-2.jpg', '/assets/product-2.jpg'],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
            { name: 'Cream', hex: '#FFFDD0' },
            { name: 'Black', hex: '#000000' },
            { name: 'Blush', hex: '#DE5D83' },
        ],
        isNewArrival: true,
        inStock: true,
        stock: 30,
    },
    {
        id: '3',
        name: 'Wide Leg Trousers',
        price: 165,
        category: 'women',
        subcategory: 'trousers',
        description: 'Elegant wide leg trousers crafted from premium wool blend. High-waisted with a polished look.',
        images: ['/assets/product-3.jpg', '/assets/product-3.jpg'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black', hex: '#000000' },
            { name: 'Navy', hex: '#000080' },
            { name: 'Taupe', hex: '#483C32' },
        ],
        isTrending: true,
        inStock: true,
        stock: 30,
    },
    {
        id: '4',
        name: 'Linen Summer Shirt',
        price: 125,
        category: 'men',
        subcategory: 'shirts',
        description: 'Relaxed fit linen shirt perfect for warm weather. Features mother of pearl buttons and a classic collar.',
        images: ['/assets/product-4.jpg', '/assets/product-4.jpg'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Sky Blue', hex: '#87CEEB' },
            { name: 'Sand', hex: '#C2B280' },
        ],
        isNewArrival: true,
        inStock: true,
        stock: 30,
    },
    {
        id: '5',
        name: 'Wool Overcoat',
        price: 495,
        originalPrice: 650,
        category: 'men',
        subcategory: 'outerwear',
        description: 'Timeless wool overcoat with a tailored silhouette. Double-breasted design with horn buttons.',
        images: ['/assets/product-5.jpg', '/assets/product-5.jpg'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Charcoal', hex: '#36454F' },
            { name: 'Camel', hex: '#C19A6B' },
        ],
        isTrending: true,
        inStock: true,
        stock: 30,
    },
    {
        id: '6',
        name: 'Merino Turtleneck',
        price: 145,
        category: 'men',
        subcategory: 'knitwear',
        description: 'Fine gauge merino wool turtleneck with a slim fit. Ultra-soft and perfect for layering.',
        images: ['/assets/product-2.jpg', '/assets/product-2.jpg'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Black', hex: '#000000' },
            { name: 'Burgundy', hex: '#722F37' },
            { name: 'Cream', hex: '#FFFDD0' },
        ],
        inStock: true,
        stock: 30,
    },
    {
        id: '7',
        name: 'Leather Tote Bag',
        price: 385,
        category: 'accessories',
        subcategory: 'bags',
        description: 'Spacious leather tote crafted from full-grain Italian leather. Features internal pockets and magnetic closure.',
        images: ['/assets/product-7.jpg', '/assets/product-7.jpg'],
        sizes: ['One Size'],
        colors: [
            { name: 'Tan', hex: '#D2B48C' },
            { name: 'Black', hex: '#000000' },
        ],
        isNewArrival: true,
        isTrending: true,
        stock: 30,
    },
    {
        id: '8',
        name: 'Cashmere Scarf',
        price: 175,
        category: 'accessories',
        subcategory: 'scarves',
        description: 'Luxurious pure cashmere scarf with fringed edges. Generously sized for versatile styling.',
        images: ['/assets/product-2.jpg', '/assets/product-2.jpg'],
        sizes: ['One Size'],
        colors: [
            { name: 'Grey', hex: '#808080' },
            { name: 'Camel', hex: '#C19A6B' },
            { name: 'Ivory', hex: '#F5F5DC' },
        ],
        stock: 30,
    },
    {
        id: '9',
        name: 'Silk Midi Dress',
        price: 225,
        originalPrice: 320,
        category: 'sale',
        subcategory: 'dresses',
        description: 'Elegant silk midi dress with a flattering A-line silhouette. Features subtle draping and a V-neckline.',
        images: ['/assets/product-1.jpg', '/assets/product-1.jpg'],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
            { name: 'Sage', hex: '#9DC183' },
            { name: 'Blush', hex: '#DE5D83' },
        ],
        stock: 30,
    },
    {
        id: '10',
        name: 'Cotton Chinos',
        price: 95,
        originalPrice: 135,
        category: 'sale',
        subcategory: 'trousers',
        description: 'Classic cotton chinos with a modern slim fit. Comfortable stretch fabric for all-day wear.',
        images: ['/assets/product-3.jpg', '/assets/product-3.jpg'],
        sizes: ['28', '30', '32', '34', '36'],
        colors: [
            { name: 'Khaki', hex: '#C3B091' },
            { name: 'Navy', hex: '#000080' },
            { name: 'Olive', hex: '#808000' },
        ],
        stock: 30,
    },
    {
        id: '11',
        name: 'Pleated Midi Skirt',
        price: 145,
        category: 'women',
        subcategory: 'skirts',
        description: 'Elegant pleated midi skirt in flowing fabric. High-waisted with a concealed side zip.',
        images: ['/assets/product-3.jpg', '/assets/product-3.jpg'],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
            { name: 'Cream', hex: '#FFFDD0' },
            { name: 'Black', hex: '#000000' },
        ],
        isNewArrival: true,
        stock: 30,
    },
    {
        id: '12',
        name: 'Leather Belt',
        price: 85,
        category: 'accessories',
        subcategory: 'belts',
        description: 'Premium leather belt with a polished metal buckle. Classic design for versatile styling.',
        images: ['/assets/product-7.jpg', '/assets/product-7.jpg'],
        sizes: ['S', 'M', 'L'],
        colors: [
            { name: 'Brown', hex: '#8B4513' },
            { name: 'Black', hex: '#000000' },
        ],
        stock: 30,
    },
];

const seedData = async () => {
    try {
        await connectDB();
        await Product.deleteMany(); // Clear existing
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
