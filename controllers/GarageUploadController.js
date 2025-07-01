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
    // Fetch all garages
    const garages = await Garage.find();

    // Fetch all uploads
    const uploads = await GarageUpload.find();

    // Combine each garage with its corresponding uploads
    const combinedData = garages.map(garage => {
      const matchingUploads = uploads.filter(
        upload => upload.garageId.toString() === garage._id.toString()
      );

      return {
        _id: garage._id,
        garageId: garage._id,
        garageName: garage.garageName,
        email: garage.email,
        phone: garage.phone,
        address: garage.address,
        opertingHours:garage.opertingHours,
        status:garage.status,
        availableService: garage.availableService,
        uploads: matchingUploads.map(upload => ({
          _id: upload._id,
          image: upload.image,
          createdAt: upload.createdAt,
          updatedAt: upload.updatedAt
        }))
      };
    });

    res.status(200).json({
      status: true,
      message: "All garages with uploads fetched successfully",
      data: combinedData
    });

  } catch (error) {
    console.error("Error fetching all combined garage data:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

