const express = require("express");
const router = express.Router();
const { createReview, getAllReviews } = require("../controllers/ReviewControllers");
const upload = require('../Middleware/Multer');
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createReview);
router.get("/", authMiddleware, getAllReviews);

module.exports = router;
