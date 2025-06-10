const express = require("express");
const router = express.Router();
const {  createClient ,  getClient , editClient , deleteClient }= require("../controllers/ClientControllers");

const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware, createClient)
router.get('/', authMiddleware, getClient )
router.patch("/:id", authMiddleware, editClient);  
router.delete("/:id", authMiddleware, deleteClient);




module.exports = router;
