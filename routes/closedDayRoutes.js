const express = require("express");
const router = express.Router();
const { createClosedDay, getAllClosedDays, updateClosedDay, deleteClosedDay  }= require("../controllers/closedDayController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware,createClosedDay);
router.get('/', authMiddleware,getAllClosedDays);
router.patch('/:id', authMiddleware,updateClosedDay);
router.delete('/:id', authMiddleware,deleteClosedDay);

module.exports = router;
