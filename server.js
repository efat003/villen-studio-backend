const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection - COMPLETE VERSION
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    console.log('🔗 Attempting MongoDB connection...');
    
    if (!mongoURI) {
      console.log('❌ MONGODB_URI environment variable is missing');
      console.log('🔄 Using in-memory database as fallback');
      return;
    }

    // Log connection details (with hidden password)
    const safeURI = mongoURI.replace(/efat00005/, '****');
    console.log(`📡 Connection URL: ${safeURI}`);
    console.log(`🔐 Database: ${mongoURI.split('/')[3]?.split('?')[0] || 'Not specified'}`);

    // Connection options
    const connectionOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    console.log('⏳ Connecting to MongoDB Atlas...');
    
    await mongoose.connect(mongoURI, connectionOptions);

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
    console.log(`🎯 Port: ${mongoose.connection.port}`);
    console.log(`🔌 Ready State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

  } catch (error) {
    console.log('❌ MongoDB Connection Failed!');
    console.log('   Error Name:', error.name);
    console.log('   Error Message:', error.message);
    console.log('   Error Code:', error.code);
    
    if (error.message.includes('auth failed')) {
      console.log('   💡 Check your username and password in MongoDB Atlas');
    } else if (error.message.includes('getaddrinfo')) {
      console.log('   💡 Check your network connection and cluster URL');
    } else if (error.message.includes('bad auth')) {
      console.log('   💡 Verify database user permissions in MongoDB Atlas');
    }
    
    console.log('🔄 Using in-memory database as fallback');
  }
};

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🎉 MongoDB event connected - Database is ready!');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB event error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB event disconnected');
});

// Initialize connection
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
  const dbStatus = mongoose.connection.readyState === 1 ? 
    `MongoDB Atlas Connected (${mongoose.connection.db.databaseName})` : 
    'In-memory Database';
  
  res.json({ 
    message: 'FashionBD Backend Server Running!',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/test', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 
    `MongoDB Atlas Connected (${mongoose.connection.db.databaseName})` : 
    'In-memory Database';
  
  res.json({ 
    message: 'FashionBD Backend Server Running!',
    database: dbStatus,
    mongodb_connected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 
    `MongoDB Atlas Connected (${mongoose.connection.db.databaseName})` : 
    'In-memory (Fallback)';
  
  res.json({ 
    status: 'OK',
    database: dbStatus,
    mongodb_connected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

// Admin Dashboard
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    success: true,
    data: dashboardData,
    database: mongoose.connection.readyState === 1 ? 'mongodb-atlas' : 'memory',
    mongodb_connected: mongoose.connection.readyState === 1
  });
});

// Import and use routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', require('./routes/products'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/api/admin/dashboard`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 MongoDB Status: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
  console.log(`📍 Live URL: https://villenstudio-backend.onrender.com`);
});