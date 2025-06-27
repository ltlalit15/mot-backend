const express = require("express");
const router = express.Router();
const { getSystemData }= require("../controllers/SystemController");

//const authMiddleware = require("../Middleware/authMiddleware")


router.get('/', getSystemData )


module.exports = router;
