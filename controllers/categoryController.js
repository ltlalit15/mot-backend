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



exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedCategory) {
      return res.status(404).json({
        status: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: updatedCategory
    });

  } catch (error) {
    console.error("Error updating category:", error);
    res.status(400).json({
      status: false,
      message: "Failed to update category",
      error: error.message
    });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        status: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(400).json({
      status: false,
      message: "Failed to delete category",
      error: error.message
    });
  }
};
