const express = require("express");
const router = express.Router();
const { createCategory, getAllCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

router.post("/", createCategory);
router.get("/", getAllCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);


module.exports = router;



