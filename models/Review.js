const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    serviceSelect: { type: String, required: true },
    customerName: String,
  rating: Number,          // 1 to 5 star
  reviewText: String,
  status: String,          // e.g., 'pending', 'approved', 'rejected'
  createdAt: Date,                   
 image: [],
 userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  

});

module.exports = mongoose.model("Review", reviewSchema);
