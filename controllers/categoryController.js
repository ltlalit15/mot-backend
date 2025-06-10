const Category = require("../models/category");




exports.createCategory = async (req, res) => {
  try {
    // Create a new category with the data from the request body
    const category = new Category(req.body);
    console.log("Saving category:", category);
    await category.save();

    res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(400).json({
      status: false,
      message: "Failed to create category",
      error: error.message
    });
  }
};


exports.getAllCategory = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find();

    if (categories.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No categories found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      data: categories
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(400).json({
      status: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
};