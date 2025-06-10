const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({


  customer: { type: String, required: true },
  vehicleDetails: String,
  dateTime: Date,
  serviceType: String,
  status: String,
  
},{ timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
