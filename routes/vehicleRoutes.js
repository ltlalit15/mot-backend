const express = require("express");
const router = express.Router();
const { vehicleDetails } = require("../controllers/vehicleController");
//const authMiddleware = require("../Middleware/authMiddleware")

router.get("/:reg", vehicleDetails);


module.exports = router;

