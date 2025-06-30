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
    const { title, description, status } = req.body;

  
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
      status,
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


exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Upload new images if provided
    let imageUrls = service.images; // keep old images unless replaced
    if (req.files?.image) {
      const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];

      // Optional: you can delete old images from Cloudinary if you store `public_id` in DB

      imageUrls = [];
      for (const file of files) {
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'services'
        });
        imageUrls.push(uploadResult.secure_url);
      }
    }

    // Update service fields
    service.title = title ?? service.title;
    service.description = description ?? service.description;
    service.status = status ?? service.status;
    service.images = imageUrls;

    await service.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service
    });

  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    await Service.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Service deleted successfully"
    });

  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};








