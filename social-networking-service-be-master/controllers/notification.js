const userService = require('../services/users');
const notification = require('../models/notification');
const HttpStatus = require('http-status-codes');

exports.getNotifications = (req, res, next) => {

    userService.findById(req.userId, 'notifications')
        .then(user => {
            return notification.find({ _id: { $in: user.notifications } })
                .select('type sender content read createdAt')
                .populate('sender', 'name username profileImageUrl')
                .sort({ createdAt: 'desc' });
        })
        .then(notifications => {
            res.status(HttpStatus.OK).json({ notifications: notifications });
        })
        .catch(error => next(error));
}