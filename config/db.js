const mongoose = require('mongoose');

const connectDB = async () => {
  // If already connected, do not initialize another connection
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      family: 4, // CRITICAL: Forces IPv4 to prevent Vercel DNS timeout dropping
    });
    console.log(`MongoDB Connected successfully!`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
