const mongoose = require('mongoose');

let isConnected = false; // Track connection state internally

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    console.log('Establishing fresh MongoDB connection...');
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB Connected successfully!');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
  }
};

module.exports = connectDB;
