const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema(
  {
    templateName: {
      type: String,
      required: true,
    },
    templateType: {
      type: String,
      required: true,
    },
    templateDescription: {
      type: String,
      maxlength: 500,
    },
    startingPoint: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailTemplate", emailTemplateSchema);
