const express = require("express");
const router = express.Router();
const { createUser, getAllUsers, Login, changePassword} = require("../controllers/userController");

const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", createUser);
router.get("/", authMiddleware, getAllUsers);


router.post("/Login", Login);
router.patch("/", authMiddleware, changePassword);


module.exports = router;
