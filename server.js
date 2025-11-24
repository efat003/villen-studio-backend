const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection - UPDATED VERSION
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/fashionbd';
    
    await mongoose.connect(mongoURI);
    console.log('🔥 MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.log('❌ MongoDB Connection Error:', error.message);
    console.log('🔄 Using in-memory database as fallback');
  }
};

connectDB();

// Temporary in-memory data (fallback)
let dashboardData = {
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

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'FashionBD Backend Server Running!',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-memory',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'FashionBD Backend Server Running!',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-memory',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-memory (Testing)';
  
  res.json({ 
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Admin Dashboard
app.get('/api/admin/dashboard', (req, res) => {
  // If MongoDB is connected, fetch real data here
  // Currently using temporary data
  res.json({
    success: true,
    data: dashboardData,
    database: mongoose.connection.readyState === 1 ? 'mongodb' : 'memory'
  });
});

// Import and use routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', require('./routes/products'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/api/admin/dashboard`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔄 Database: ${mongoose.connection.readyState === 1 ? 'MongoDB' : 'In-memory'}`);
});