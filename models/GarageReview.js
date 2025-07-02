const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  garageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garage',
    required: true
  },
  service: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  name: {
    type: String,
    required: true
  },
  message: {
    type: String
  }
}, { timestamps: true });


module.exports = mongoose.model('GarageReview', reviewSchema);
