const express = require("express");
const router = express.Router();
const { createService, getAllServices, updateService, deleteService } = require("../controllers/serviceController");
const upload = require('../Middleware/Multer');
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createService);
router.get("/", authMiddleware, getAllServices);
router.patch("/:id", authMiddleware, updateService);
router.delete("/:id", authMiddleware, deleteService);



module.exports = router;
