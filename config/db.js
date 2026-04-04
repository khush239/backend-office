const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
  // CRITICAL VERCEL FIX: Catch asynchronous TCP connection drops so Node doesn't hard-crash
  mongoose.connection.on('error', (err) => {
    console.error('Mongoose global passive error caught:', err);
  });
  // Cleanly wipe the global cache if Vercel natively kills the socket, so the next request reconnects instantly
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection dropped cleanly. Dropping cache...');
    global.mongoose.conn = null;
    global.mongoose.promise = null;
  });
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    console.log('Initializing fresh MongoDB connection...');
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB Connected successfully!');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    // DO NOT swallow error, throw to explicitly crash failing requests instantly rather than hanging
    throw error;
  }
};

module.exports = connectDB;
