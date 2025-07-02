const express = require("express");
const router = express.Router();
const { createGarageReview }= require("../controllers/GarageReviewController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware, createGarageReview)
// router.get('/', authMiddleware, getCombinedGarageData)


module.exports = router;
