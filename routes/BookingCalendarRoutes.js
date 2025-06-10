const express = require("express");
const router = express.Router();
const {  createCalendarBook ,  getCalendarBook , updateBookCalendar , deleteBookCalendar }= require("../controllers/CalendarControllers");

const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware, createCalendarBook)
router.get('/', authMiddleware, getCalendarBook )
router.put("/update/:Id", authMiddleware, updateBookCalendar);
router.delete("/delete/:Id", authMiddleware, deleteBookCalendar);



module.exports = router;
