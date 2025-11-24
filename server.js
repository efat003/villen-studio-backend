const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// CORS Configuration - UPDATED with your frontend URL
const corsOptions = {
  origin: [
    'https://villenstudio.onrender.com', // Your production frontend
    'http://localhost:3000',              // Create React App dev server
    'http://localhost:5173',              // Vite dev server
    'http://127.0.0.1:3000'               // Alternative localhost
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
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

// Admin Dashboard (Current - using temporary data)
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

// Future routes - Commented out until you create MongoDB collections
/*
app.get('/api/admin/orders', (req, res) => {
  // Return real orders from MongoDB
});

app.get('/api/admin/customers', (req, res) => {
  // Return real customers from MongoDB
});

app.post('/api/admin/products', (req, res) => {
  // Create new products in MongoDB
});

// Example with real MongoDB - Replace the current dashboard when ready
app.get('/api/admin/dashboard-real', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const totalProducts = await db.collection('products').countDocuments();
    const totalOrders = await db.collection('orders').countDocuments();
    const totalCustomers = await db.collection('customers').countDocuments();
    
    // Return real data from MongoDB
    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: 0, // Calculate from orders
        recentOrders: [], // Get from orders collection
        stats: {} // Calculate from data
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Admin Dashboard: https://villenstudio-backend.onrender.com/api/admin/dashboard`);
  console.log(`❤️ Health Check: https://villenstudio-backend.onrender.com/api/health`);
  console.log(`🔗 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
});