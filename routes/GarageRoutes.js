const express = require("express");
const router = express.Router();
const {  createGarage ,  getAllGarages, editGarage }= require("../controllers/GarageControllers");
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware, createGarage)
router.get('/', authMiddleware, getAllGarages)
router.patch('/:id', authMiddleware, editGarage )



module.exports = router;
