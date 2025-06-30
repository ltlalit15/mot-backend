const express = require("express");
const router = express.Router();
const { createGarageUpload, getCombinedGarageData }= require("../controllers/GarageUploadController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware, createGarageUpload)
router.get('/:garageId', authMiddleware, getCombinedGarageData)


module.exports = router;
