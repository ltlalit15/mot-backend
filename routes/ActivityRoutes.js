const express = require("express");
const router = express.Router();
const { logActivity, getAdminActivities }= require("../controllers/ActivityController");

//const authMiddleware = require("../Middleware/authMiddleware")

router.post('/:logActivity', logActivity )

router.get('/', getAdminActivities )


module.exports = router;
