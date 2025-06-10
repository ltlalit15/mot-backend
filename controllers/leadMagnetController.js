const cloudinary = require('cloudinary').v2;
const LeadMagnet = require("../models/leadMagnet");
const Category = require("../models/category");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

exports.createLeadMagnet = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      description
    } = req.body;

    // Validate the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        status: false,
        message: "Category not found"
      });
    }

      let image = ''; 
  if (req.files?.image) {
    try {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        { folder: 'member_measurements' }
      );
      image = result.secure_url; // Get the image URL from Cloudinary
    } catch (uploadErr) {
      console.error("Image upload error:", uploadErr);
      return res.status(500).json({ status: false, message: "Image upload failed." });
    }
  }

    // Create a new lead magnet with images
    const newLeadMagnet = new LeadMagnet({
      title,
      type,
      category,
      description,
      image: image ? image : null // Store the image URL or null if no image is uploaded
    });

    console.log("Saving lead magnet:", newLeadMagnet);
    await newLeadMagnet.save();

    res.status(201).json({
      status: true,
      message: "Lead magnet created successfully",
      data: newLeadMagnet
    });
  } catch (error) {
    console.error("Error creating lead magnet:", error);
    res.status(400).json({
      status: false,
      message: "Failed to create lead magnet",
      error: error.message
    });
  }
};


exports.getAllLeadMagnets = async (req, res) => {
  try {
    // Fetch all lead magnets and populate category details
    const leadMagnets = await LeadMagnet.find()
      .populate('category', 'name') // Populate the category field with the 'name' field from the Category collection
      .exec();

    // Respond with the lead magnets and their associated category names
    res.status(200).json({
      status: true,
      message: "Lead magnets fetched successfully",
      data: leadMagnets
    });
  } catch (error) {
    console.error("Error fetching lead magnets:", error);
    res.status(400).json({
      status: false,
      message: "Failed to fetch lead magnets",
      error: error.message
    });
  }
};
