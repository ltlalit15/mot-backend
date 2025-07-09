const express = require("express");
const router = express.Router();
const { createGarageUpload, getCombinedGarageData, getGarageData }= require("../controllers/GarageUploadController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware, createGarageUpload)
router.get('/', authMiddleware, getCombinedGarageData)
router.get('/getGarageData/:garageId', getGarageData)


module.exports = router;
