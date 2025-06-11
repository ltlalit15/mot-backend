const express = require("express");
const router = express.Router();
const {  createCalendarBook ,  getCalendarBook , updateBookCalendar , deleteBookCalendar }= require("../controllers/CalendarControllers");

const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware, createCalendarBook)
router.get('/', authMiddleware, getCalendarBook )
router.patch("/:id", authMiddleware, updateBookCalendar);
router.delete("/:id", authMiddleware, deleteBookCalendar);



module.exports = router;
