const express = require("express");
const router = express.Router();

// Controller function import karo (function name spelling check kar lo)
const { getDashboardData } = require("../controllers/vehicleDashboardController");

const authMiddleware = require("../Middleware/authMiddleware")



router.get("/:userId", authMiddleware, getDashboardData)

module.exports = router;
