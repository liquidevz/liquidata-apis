const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '#',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema); 