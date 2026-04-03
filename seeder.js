const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Admin = require('./models/Admin');
const productsData = require('./data/products');
const categoriesData = require('./data/categories');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await Admin.deleteMany();

    // Create admin
    await Admin.create({
      email: 'admin@padmavatienterprises.com',
      password: 'adminpassword123',
    });

    // Insert categories
    const createdCategories = await Category.insertMany(categoriesData);

    // Map category names to inserted ObjectIds
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Insert products with mapped category IDs
    const sampleProducts = productsData.map((product) => {
      return {
        ...product,
        category: categoryMap[product.categoryName],
      };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await Admin.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destroy: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
