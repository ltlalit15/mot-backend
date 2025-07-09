const express = require("express");
const router = express.Router();
const { createGarageReview, getAllGarageReview, getReviewsByGarageId }= require("../controllers/GarageReviewController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', createGarageReview)
router.get('/', authMiddleware, getAllGarageReview)
router.get('/getReviewsByGarageId/:garageId', authMiddleware, getReviewsByGarageId)


module.exports = router;
