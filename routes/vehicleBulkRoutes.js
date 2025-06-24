const express = require("express");
const router = express.Router();
const { vehicleBulk } = require("../controllers/vehicleBulkController");
//const authMiddleware = require("../Middleware/authMiddleware")

router.get("/", vehicleBulk);


module.exports = router;

