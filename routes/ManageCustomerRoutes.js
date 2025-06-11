const express = require("express");
const router = express.Router();
const { createManageCustomer, getAllManageCustomer, deleteManageCustomer } = require("../controllers/ManageCustomer");
const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", authMiddleware, createManageCustomer);
router.get("/", authMiddleware, getAllManageCustomer);
router.delete("/:id", authMiddleware, deleteManageCustomer);

module.exports = router;
