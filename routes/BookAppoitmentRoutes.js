const express = require("express");
const router = express.Router();

// Controller function import karo (function name spelling check kar lo)
const { BookAppointment, getBookAppointments, getVehicleHistory, getAllVehicleHistories, editBookAppointment, deleteBookAppointment } = require("../controllers/BookAppoitmentController");

const authMiddleware = require("../Middleware/authMiddleware")

// POST route define karo
router.post("/", authMiddleware,  BookAppointment);

router.get("/", authMiddleware, getBookAppointments)

router.get("/:vehicleRegistration", authMiddleware, getVehicleHistory)

router.get("/", getAllVehicleHistories)

router.patch("/:id", authMiddleware, editBookAppointment)

router.delete("/:id", authMiddleware, deleteBookAppointment)






module.exports = router;



