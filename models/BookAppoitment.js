const mongoose = require("mongoose");

const bookAppoitSchema = new mongoose.Schema({
  vehicle: {
    vehicleRegistration: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    engineSize: { type: String, required: true },
    fuelType: { type: String, required: true },
    motStatus: { type: String, required: true },
    daysOverdue: { type: Number }
  },
  appointmentDetails: {
    selectedDate: { type: Date, required: true },
    selectedTime: { type: String, required: true },
    selectedServices: [{
      preMOT: { type: String },
      basicService: { type: String },
      fullService: { type: String },
      repairs: { type: String }
    }]
  },
   bookingSummary: {
    additionalServices: [
      {
        serviceName: { type: String, required: true },
        price: { type: Number, required: true }
      }
    ]
  },
  paymentDetails: {
    paymentMethod: {
      fullName: { type: String, required: true },
      emailAddress: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      amount: { type: Number, required: true },
      paymentPurpose: { type: String, required: true }
    }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("BookAppoitment", bookAppoitSchema);
