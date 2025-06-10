
const mongoose = require("mongoose");

const bookAppoitSchema = new mongoose.Schema({
  vehicle: {
    vehicleRegistration: { type: String, required: true },
    vinNumber: { type: String, required: true },
    lastMotDate: { type: Date, required: true },
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
    additionalServices: [{
      serviceName: { type: String },
      price: { type: Number }
    }],
    costSummary: {
      motTest: { type: Number, required: true },
      additionalServices: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  },
  paymentDetails: {
    reactivationFee: { type: Number, required: true },
    administrativeProcessing: { type: Number, required: true },
    vat: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String },
    cardDetails: {
      cardholderName: { type: String },
      cardNumber: { type: String },
      expiryDate: { type: String },
      cvv: { type: String }
    },
    billingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      city: { type: String },
      postcode: { type: String }
    }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("BookAppoitment", bookAppoitSchema);