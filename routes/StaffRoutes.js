const express = require("express");
const router = express.Router();
const { createStaff, getAllStaff, editStaff, deleteStaff } = require("../controllers/StaffController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createStaff);
router.get("/", authMiddleware, getAllStaff);
router.patch("/:id", authMiddleware, editStaff);
router.delete("/:id", authMiddleware, deleteStaff);
module.exports = router;
