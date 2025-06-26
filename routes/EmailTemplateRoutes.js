const express = require("express");
const router = express.Router();
const { createEmailTemplate, getAllEmailTemplates, updateEmailTemplate, deleteEmailTemplate  }= require("../controllers/EmailTemplateController");
const authMiddleware = require("../Middleware/authMiddleware")

router.post('/', authMiddleware,createEmailTemplate);
router.get('/', authMiddleware,getAllEmailTemplates);
router.patch('/:id', authMiddleware,updateEmailTemplate);
router.delete('/:id', authMiddleware,deleteEmailTemplate);

module.exports = router;
