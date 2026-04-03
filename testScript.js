const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
require('dotenv').config();

connectDB().then(async () => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(3).populate('category');
    console.log(JSON.stringify(products, null, 2));
  } catch(e) { console.error(e); }
  process.exit();
});
