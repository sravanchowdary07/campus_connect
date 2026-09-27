const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect';
    
    // Attempt local MongoDB connection first if USE_MEMORY_DB is not explicitly 'true'
    if (process.env.USE_MEMORY_DB !== 'true') {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log('MongoDB Connected to local database server');
        return;
      } catch (err) {
        console.warn('Local MongoDB connection failed, spinning up MongoMemoryServer...');
      }
    }

    // Memory DB fallback
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Connected to MongoMemoryServer at ${memoryUri}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
