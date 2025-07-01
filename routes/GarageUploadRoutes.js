const express = require("express");
const router = express.Router();
const { createGarageUpload, getCombinedGarageData }= require("../controllers/GarageUploadController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware, createGarageUpload)
router.get('/', authMiddleware, getCombinedGarageData)


module.exports = router;
