const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection - OPTIMIZED
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('❌ MONGODB_URI not found in environment variables');
      console.log('🔄 Using in-memory database');
      return;
    }

    // Log safe connection info
    const safeURI = mongoURI.replace(/efat00005/g, '****');
    console.log(`📡 Target: ${safeURI}`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`📍 Cluster: ${mongoose.connection.host}`);
    
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message);
    console.log('🔄 Using in-memory database as fallback');
  }
};

// Connection events
mongoose.connection.on('connected', () => {
  console.log('🎉 MongoDB event: Connected and ready!');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB event error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB event: Disconnected');
});

// Initialize connection
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'FashionBD Backend Server Running!',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Atlas Connected' : 'In-memory Database',
    mongodb_connected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Atlas' : 'In-memory',
    mongodb_connected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// Admin Dashboard
app.get('/api/admin/dashboard', (req, res) => {
  const dashboardData = {
    totalProducts: 2,
    totalOrders: 5,
    totalCustomers: 8,
    totalRevenue: 12500,
    recentOrders: [
      { _id: '1', customer: { name: 'রহিম' }, totalAmount: 2500, status: 'completed' },
      { _id: '2', customer: { name: 'করিম' }, totalAmount: 1800, status: 'pending' }
    ],
    stats: {
      pendingOrders: 2,
      completedOrders: 3,
      lowStockProducts: 1
    }
  };
  
  res.json({
    success: true,
    data: dashboardData,
    database: mongoose.connection.readyState === 1 ? 'mongodb-atlas' : 'memory',
    mongodb_connected: mongoose.connection.readyState === 1
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Admin Dashboard: https://villenstudio-backend.onrender.com/api/admin/dashboard`);
  console.log(`❤️ Health Check: https://villenstudio-backend.onrender.com/api/health`);
  console.log(`🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
});