const express = require("express");
const router = express.Router();
const { createLeadMagnet, getAllLeadMagnets } = require("../controllers/leadMagnetController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createLeadMagnet);
router.get("/", authMiddleware, getAllLeadMagnets);



module.exports = router;
