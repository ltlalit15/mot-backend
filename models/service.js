const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  status: {
    type: String,
   
  },
  images: []
    
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
