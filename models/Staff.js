const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({


  fullName: { type: String, required: true },
  email: String,
  phone: String,
  image: [],
  department: String,
  role: String,
  joiningDate: Date, 
  status: String,
  schedule: [
    {
      day: String,
      isWorking: Boolean,
      startTime: String,
      endTime: String,
    },
  ],
  permissions: [String],
});

module.exports = mongoose.model("Staff", staffSchema);
