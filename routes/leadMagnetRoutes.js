const express = require("express");
const router = express.Router();
const { createLeadMagnet, getAllLeadMagnets, editLeadMagnet, deleteLeadMagnet } = require("../controllers/leadMagnetController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createLeadMagnet);
router.get("/", authMiddleware, getAllLeadMagnets);

router.patch("/:id", authMiddleware, editLeadMagnet);
router.delete("/:id", authMiddleware, deleteLeadMagnet);






module.exports = router;
