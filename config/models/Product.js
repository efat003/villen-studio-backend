// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'প্রোডাক্টের নাম দিন'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'প্রোডাক্টের বিবরণ দিন']
  },
  price: {
    type: Number,
    required: [true, 'দাম দিন'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'ক্যাটাগরি নির্বাচন করুন'],
    enum: ['শার্ট', 'প্যান্ট', 'টি-শার্ট', 'জুতা', 'অ্যাকসেসরিজ']
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: [true, 'স্টক সংখ্যা দিন'],
    min: 0
  },
  sizes: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL']
  }],
  colors: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);