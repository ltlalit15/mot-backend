const express = require("express");
const router = express.Router();
const { createCustomer, getCustomer } = require("../controllers/ManageCustomer");
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createCustomer);
router.get("/", authMiddleware, getCustomer);

module.exports = router;
