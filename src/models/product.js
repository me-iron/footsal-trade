const mongoose = require('mongoose');

// 매치 정보 스키마
const matchSchema = new mongoose.Schema({
  plabUrl: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  matchDatetime: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 시착/거래 신청 스키마
const tryRequestSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  requestType: {
    type: String,
    enum: ['TRY', 'BUY'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING'
  },
  phoneNumber: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 상품 스키마
const productSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  description: String,
  images: [String],
  status: {
    type: String,
    enum: ['AVAILABLE', 'TESTING', 'SOLD'],
    default: 'AVAILABLE'
  },
  match: matchSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
const TryRequest = mongoose.model('TryRequest', tryRequestSchema);

module.exports = {
  Product,
  TryRequest
}; 