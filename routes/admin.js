// backend/routes/admin.js
const express = require('express');
const router = express.Router();

// Temporary in-memory data until database is connected
let products = [
  {
    _id: '1',
    name: 'প্রিমিয়াম শার্ট',
    price: 1200,
    category: 'শার্ট',
    stock: 50,
    description: 'হাই কোয়ালিটি কটন শার্ট'
  },
  {
    _id: '2',
    name: 'ডিজাইনার টি-শার্ট', 
    price: 800,
    category: 'টি-শার্ট',
    stock: 100,
    description: 'কটন টি-শার্ট'
  }
];

// Get all products
router.get('/products', async (req, res) => {
  try {
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'প্রোডাক্টস লোড করতে সমস্যা',
      error: error.message
    });
  }
});

// Create new product
router.post('/products', async (req, res) => {
  try {
    const newProduct = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    products.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'প্রোডাক্ট সফলভাবে তৈরি হয়েছে',
      data: newProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'প্রোডাক্ট তৈরি করতে সমস্যা',
      error: error.message
    });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p._id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'প্রোডাক্ট খুঁজে পাওয়া যায়নি'
      });
    }

    products[productIndex] = { ...products[productIndex], ...req.body };

    res.json({
      success: true,
      message: 'প্রোডাক্ট আপডেট হয়েছে',
      data: products[productIndex]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'প্রোডাক্ট আপডেট করতে সমস্যা',
      error: error.message
    });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p._id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'প্রোডাক্ট খুঁজে পাওয়া যায়নি'
      });
    }

    products.splice(productIndex, 1);

    res.json({
      success: true,
      message: 'প্রোডাক্ট ডিলিট হয়েছে'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'প্রোডাক্ট ডিলিট করতে সমস্যা',
      error: error.message
    });
  }
});

module.exports = router;

// Real product creation
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});