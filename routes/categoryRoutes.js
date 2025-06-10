const express = require("express");
const router = express.Router();
const { createCategory,  getAllCategory } = require("../controllers/categoryController");

router.post("/", createCategory);
router.get("/", getAllCategory);



module.exports = router;
