
const mongoose = require("mongoose");

const bookingCalendarSchema = new mongoose.Schema({
  customerName: {
    type: String, },
  vehicle: String,
  location: String,
  Date: Date,
  Time: String,
  servicesType: [
    {
      MOT: String,
      Service: String,
      inspection: String,
      repair: String,
      oilChange: String,
      tireReplacement: String,
    },
  ],
  notes: String,
});

module.exports = mongoose.model("BookingCalendar", bookingCalendarSchema);