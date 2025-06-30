const mongoose = require("mongoose");

const garageSchema = new mongoose.Schema({
    garageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garage',
        required: true
    },
    image: {
        type: [String], // URL from Cloudinary or local path
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("GarageUpload", garageSchema);
