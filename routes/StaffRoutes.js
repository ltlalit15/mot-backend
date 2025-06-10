const express = require("express");
const router = express.Router();
const { createStaff, getAllStaff, editStaff } = require("../controllers/StaffController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createStaff);
router.get("/", authMiddleware, getAllStaff);
router.patch("/:id", authMiddleware, editStaff);
module.exports = router;
