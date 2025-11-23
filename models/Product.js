const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['শার্ট', 'প্যান্ট', 'টি-শার্ট', 'জিন্স', 'জ্যাকেট', 'অন্যান্য']
  },
  size: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL']
  }],
  color: [{
    type: String
  }],
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);