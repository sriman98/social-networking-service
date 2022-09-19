const express = require('express');
const notificationController = require('../controllers/notification');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/notifications', isAuth, notificationController.getNotifications);

module.exports = router;