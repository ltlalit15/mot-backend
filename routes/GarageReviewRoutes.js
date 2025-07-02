const express = require("express");
const router = express.Router();
const { createGarageReview, getAllGarageReview }= require("../controllers/GarageReviewController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware, createGarageReview)
router.get('/', authMiddleware, getAllGarageReview)


module.exports = router;
