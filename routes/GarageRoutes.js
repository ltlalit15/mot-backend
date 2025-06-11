const express = require("express");
const router = express.Router();
const {  createGarage ,  getAllGarages, editGarage, deleteGarage }= require("../controllers/GarageControllers");
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware, createGarage)
router.get('/', authMiddleware, getAllGarages)
router.patch('/:id', authMiddleware, editGarage)

router.delete('/:id', authMiddleware, deleteGarage)

module.exports = router;
