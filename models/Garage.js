const mongoose = require("mongoose");

const garageSchema = new mongoose.Schema({
  garageName: { type: String, required: true },
  status: { type: String },
  address: { type: String },
  phone: { type: Number },
  email: { type: String, require: true },
  opertingHours: { type: String },
  availableService: { type: [String] },
});

module.exports = mongoose.model("Garage", garageSchema);
