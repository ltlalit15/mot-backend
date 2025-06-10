const express = require("express");
const router = express.Router();
const { getReportDashboardData } = require("../controllers/reportDashbaord");
const authMiddleware = require("../Middleware/authMiddleware")

router.get("/", authMiddleware, getReportDashboardData);



module.exports = router;
