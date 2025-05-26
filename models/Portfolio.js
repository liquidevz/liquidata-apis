const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  tags: [{
    type: String
  }],
  link: {
    type: String,
    default: '#'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', PortfolioSchema); 