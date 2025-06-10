const multer = require('multer');
const { storage } = require('../config/config');

const upload = multer({ storage });

module.exports = upload;