const GarageUpload = require('../models/GarageUpload');
const cloudinary = require('cloudinary').v2;
const Garage = require('../models/Garage');
const mongoose = require('mongoose');


exports.createGarageUpload = async (req, res) => {
  try {
    const { garageId } = req.body;

    if (!garageId) {
      return res.status(400).json({ status: false, message: "garageId is required" });
    }

    let imageUrls = [];
    if (req.files?.image) {
      const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];

      for (const file of files) {
        const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "garages"
        });
        imageUrls.push(uploaded.secure_url);
      }
    } else {
      return res.status(400).json({ status: false, message: "At least one image is required" });
    }

    const garage = new GarageUpload({
      garageId,
      image: imageUrls
    });

    await garage.save();

    res.status(201).json({
      status: true,
      message: "Garage created successfully",
      data: garage
    });

  } catch (error) {
    console.error("Create Garage Error:", error);
    res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};


exports.getCombinedGarageData = async (req, res) => {
  try {
    const { garageId } = req.params;

    if (!garageId || !mongoose.Types.ObjectId.isValid(garageId)) {
      return res.status(400).json({
        status: false,
        message: "Valid garageId is required in URL params"
      });
    }

    const garageObjectId = new mongoose.Types.ObjectId(garageId);

    const garage = await Garage.findById(garageObjectId);
    const uploads = await GarageUpload.find({ garageId: garageObjectId });

    console.log("Garage found:", garage);
    console.log("Uploads found:", uploads);

    if (!garage && uploads.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No data found for the provided garageId"
      });
    }

    const garageEntry = garage ? {
      _id: garage._id,
      garageId: garage._id,
      garageName: garage.garageName,
      email: garage.email,
      phone: garage.phone,
      address: garage.address,
      availableService: garage.availableService,
     
    } : null;

    const uploadEntries = uploads.map(upload => ({
      _id: upload._id,
      garageId: upload.garageId,
      image: upload.image,
      createdAt: upload.createdAt,
      updatedAt: upload.updatedAt,
    
    }));

    const combined = [
      ...(garageEntry ? [garageEntry] : []),
      ...uploadEntries
    ];

    res.status(200).json({
      status: true,
      message: "Combined garage data fetched successfully",
      data: combined
    });

  } catch (error) {
    console.error("Error fetching combined garage data:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
