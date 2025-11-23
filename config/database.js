// backend/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // First try local MongoDB
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/fashionbd', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Local MongoDB connection failed:', error.message);
    
    // Fallback: Try MongoDB Atlas (replace with your credentials later)
    try {
      console.log('🔄 Trying MongoDB Atlas connection...');
      const conn = await mongoose.connect('mongodb+srv://fashionbd-admin:test123@cluster0.mongodb.net/fashionbd?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB Atlas Connected`);
    } catch (atlasError) {
      console.error('❌ MongoDB Atlas connection failed:', atlasError.message);
      
      // Final fallback: Use in-memory database for testing
      console.log('🔄 Using in-memory database for testing...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`✅ In-memory MongoDB Connected for testing`);
      } catch (memoryError) {
        console.error('❌ All database connections failed');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;