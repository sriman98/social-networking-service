const express = require('express');
const multer = require('../middleware/multer');
const filesController = require('../controllers/files');

const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/fileupload', isAuth, multer.single('file'), filesController.uploadFile);

module.exports = router;