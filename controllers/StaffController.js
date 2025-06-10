const Staff = require("../models/Staff");

const cloudinary = require('cloudinary').v2;


// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

exports.createStaff = async (req, res) => {
  try {
    let imageUrls = [];

    // Validate schedule field is an array of objects
    if (!Array.isArray(req.body.schedule)) {
      // Parse the schedule field if it's a stringified JSON
      try {
        req.body.schedule = JSON.parse(req.body.schedule);
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: "Schedule must be an array of objects."
        });
      }
    }

    // Validate permissions field is an array of strings
    if (!Array.isArray(req.body.permissions)) {
      // Parse the permissions field if it's a stringified JSON
      try {
        req.body.permissions = JSON.parse(req.body.permissions);
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: "Permissions must be an array of strings."
        });
      }
    }

    // Check if images are present in the request
    if (req.files?.image) {
      const imageArray = req.files.image instanceof Array ? req.files.image : [req.files.image]; // Ensure it's an array

      // Upload all images to Cloudinary
      for (let image of imageArray) {
        try {
          const result = await cloudinary.uploader.upload(image.tempFilePath, { folder: "staff_images" });
          imageUrls.push(result.secure_url);  // Store the secure URL of the uploaded image
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
          return res.status(500).json({ status: "false", message: "Image upload failed." });
        }
      }
    }

    // Create the staff object with the uploaded image URLs
    const staffData = { 
      ...req.body, 
      image: imageUrls  // Store the image URLs in the image field
    };

    const staff = new Staff(staffData);

    console.log("Saving staff:", staff);
    await staff.save();

    res.status(201).json({
      status: true,
      message: "Staff created successfully",
      data: staff
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(400).json({
      status: false,
      message: "Failed to create staff",
      error: error.message
    });
  }
};


exports.getAllStaff = async (req, res) => {
  try {
    // Fetch all staff members from the database
    const staffMembers = await Staff.find();

    if (!staffMembers || staffMembers.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No staff found."
      });
    }

    // Return the staff members' data, including schedule and permissions
    res.status(200).json({
      status: true,
      message: "Staff retrieved successfully",
      data: staffMembers.map(staff => ({
        _id: staff._id,
        fullName: staff.fullName,
        email: staff.email,
        phone: staff.phone,
        image: staff.image,  // Ensure image is returned as an array of URLs
        department: staff.department,
        role: staff.role,
        joiningDate: staff.joiningDate,
        status: staff.status,
        schedule: staff.schedule,
        permissions: staff.permissions
      }))
    });
  } catch (error) {
    console.error("Error fetching staff members:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch staff",
      error: error.message
    });
  }
};


exports.editStaff = async (req, res) => {
  try {
    const { id } = req.params; // Get staff ID from request parameters
    let imageUrls = [];

    // Validate schedule field is an array of objects
    if (req.body.schedule && !Array.isArray(req.body.schedule)) {
      // Parse the schedule field if it's a stringified JSON
      try {
        req.body.schedule = JSON.parse(req.body.schedule);
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: "Schedule must be an array of objects."
        });
      }
    }

    // Validate permissions field is an array of strings
    if (req.body.permissions && !Array.isArray(req.body.permissions)) {
      // Parse the permissions field if it's a stringified JSON
      try {
        req.body.permissions = JSON.parse(req.body.permissions);
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: "Permissions must be an array of strings."
        });
      }
    }

    // Check if images are present in the request
    if (req.files?.image) {
      const imageArray = req.files.image instanceof Array ? req.files.image : [req.files.image]; // Ensure it's an array

      // Upload all images to Cloudinary
      for (let image of imageArray) {
        try {
          const result = await cloudinary.uploader.upload(image.tempFilePath, { folder: "staff_images" });
          imageUrls.push(result.secure_url);  // Store the secure URL of the uploaded image
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
          return res.status(500).json({ status: "false", message: "Image upload failed." });
        }
      }
    }

    // Find the staff member by ID
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({
        status: false,
        message: "Staff not found."
      });
    }

    // Update the staff object with the provided data
    const staffData = { 
      ...req.body,
      image: imageUrls.length > 0 ? imageUrls : staff.image  // Keep existing image if none is uploaded
    };

    // Update the staff document
    const updatedStaff = await Staff.findByIdAndUpdate(id, staffData, { new: true });

    res.status(200).json({
      status: true,
      message: "Staff updated successfully",
      data: updatedStaff
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(400).json({
      status: false,
      message: "Failed to update staff",
      error: error.message
    });
  }
};




