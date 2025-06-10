const Service = require('../models/service');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


// Create New Service
exports.createService = async (req, res) => {
  try {
    const { title, description, tag, lastUpdated } = req.body;

  
    // Upload image(s) to Cloudinary
    let imageUrls = [];
    if (req.files?.image) {
      const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
      for (const file of files) {
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'services'
        });
        imageUrls.push(uploadResult.secure_url);
      }
    }

    const service = new Service({
      title,
      description,
      tag,
      lastUpdated: new Date(lastUpdated),
      images: imageUrls,
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: service
    });

  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



// Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find(); // Newest first

    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    console.error("Fetch services error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

