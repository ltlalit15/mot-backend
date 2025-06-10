const express = require("express");
const router = express.Router();
const { getAdminDashboardData } = require("../controllers/adminDashboard");
const authMiddleware = require("../Middleware/authMiddleware")

router.get("/", authMiddleware, getAdminDashboardData);



module.exports = router;
