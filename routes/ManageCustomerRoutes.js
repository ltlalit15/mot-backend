const express = require("express");
const router = express.Router();
const { createManageCustomer, getAllManageCustomer } = require("../controllers/ManageCustomer");
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createManageCustomer);
router.get("/", authMiddleware, getAllManageCustomer);

module.exports = router;
