const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  tag: String,
  lastUpdated: {
    type: String,
   
  },
  images: []
    
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
