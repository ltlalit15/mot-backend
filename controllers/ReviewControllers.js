const Review = require("../models/Review");  
const mongoose = require("mongoose");

const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});



exports.createReview = async (req, res) => {
  try {

    // Validate the rating is between 1 and 5
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: false,
        message: "Rating must be between 1 and 5."
      });
    }
    let imageUrls = [];

    // Check if images are present in the request
    if (req.files?.image) {
      const imageArray = req.files.image instanceof Array ? req.files.image : [req.files.image]; // Ensure it's an array
      
      // Upload all images to Cloudinary
      for (let image of imageArray) {
        try {
          const result = await cloudinary.uploader.upload(image.tempFilePath, { folder: "member_images" });
          imageUrls.push(result.secure_url);  // Store the secure URL of the uploaded image
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
          return res.status(500).json({ status: "false", message: "Image upload failed." });
        }
      }
    }

    // Create the review object with the uploaded image URLs
    const reviewData = { 
      ...req.body, 
      image: imageUrls 
    };

    const review = new Review(reviewData);

    console.log("Saving review:", review);
    await review.save();

    res.status(201).json({
      status: true,
      message: "Review created successfully",
      data: review
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(400).json({
      status: false,
      message: "Failed to create review",
      error: error.message
    });
  }
};



exports.getAllReviews = async (req, res) => {
  try {
    // Fetch all reviews from the database
    const reviews = await Review.find();

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No reviews found."
      });
    }

    // Send response with all reviews and their images
    res.status(200).json({
      status: true,
      message: "Fetched all reviews successfully",
      data: reviews.map(review => ({
        _id: review._id,
        serviceSelect: review.serviceSelect,
        customerName: review.customerName,
        rating: review.rating,
        reviewText: review.reviewText,
        status: review.status,
        createdAt: review.createdAt,
        images: review.image,  // Return the images as an array
        userId: review.userId
      }))
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch reviews",
      error: error.message
    });
  }
};




exports.editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        status: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    let imageUrls = [];

    // Handle image uploads if present
    if (req.files?.image) {
      const imageArray = req.files.image instanceof Array ? req.files.image : [req.files.image];
      for (let image of imageArray) {
        try {
          const result = await cloudinary.uploader.upload(image.tempFilePath, { folder: "member_images" });
          imageUrls.push(result.secure_url);
        } catch (uploadErr) {
          console.error("Image upload error:", uploadErr);
          return res.status(500).json({ status: false, message: "Image upload failed." });
        }
      }
    }

    const updatedData = {
      ...req.body,
      ...(imageUrls.length > 0 && { image: imageUrls })  // update image only if new ones are uploaded
    };

    const updatedReview = await Review.findByIdAndUpdate(id, { $set: updatedData }, { new: true });

    if (!updatedReview) {
      return res.status(404).json({
        status: false,
        message: "Review not found.",
      });
    }

    res.status(200).json({
      status: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(400).json({
      status: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};




exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        status: false,
        message: "Review not found.",
      });
    }

    res.status(200).json({
      status: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};
