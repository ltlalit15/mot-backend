const express = require("express");
const router = express.Router();
const { createService, getAllServices } = require("../controllers/serviceController");
const upload = require('../Middleware/Multer');
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createService);
router.get("/", authMiddleware, getAllServices);

module.exports = router;
