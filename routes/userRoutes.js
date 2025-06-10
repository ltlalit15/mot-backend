const express = require("express");
const router = express.Router();
const { createUser, getAllUsers, Login} = require("../controllers/userController");

const authMiddleware = require("../Middleware/authMiddleware")

router.post("/", createUser);
router.get("/", authMiddleware, getAllUsers);


router.post("/Login", Login);



module.exports = router;
