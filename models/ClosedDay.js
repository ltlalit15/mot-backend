const mongoose = require('mongoose');

const ClosedDaySchema = new mongoose.Schema({
  day: {
    type: Number,
    min: 1,
    max: 31,
    required: true
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    maxlength: 25
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  isImportant: {
    type: String,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('ClosedDay', ClosedDaySchema);
