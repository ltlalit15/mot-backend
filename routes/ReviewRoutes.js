const express = require("express");
const router = express.Router();
const { createReview, getAllReviews, editReview, deleteReview  } = require("../controllers/ReviewControllers");
const upload = require('../Middleware/Multer');
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createReview);
router.get("/", authMiddleware, getAllReviews);
router.patch("/:id", authMiddleware, editReview);
router.delete("/:id", authMiddleware, deleteReview);
module.exports = router;
