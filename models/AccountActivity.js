const mongoose = require('mongoose');

const AccountActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  panel: String,     // e.g. "Admin panel"
  activity: String,  // e.g. "Login (administrator)"
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AccountActivity", AccountActivitySchema);
