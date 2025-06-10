const mongoose = require("mongoose");

const leadMagnetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },  // e.g., Ebook, PDF
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String, required: true },
 image: [] // Path to the file uploaded
});

const LeadMagnet = mongoose.model("LeadMagnet", leadMagnetSchema);

module.exports = LeadMagnet;
