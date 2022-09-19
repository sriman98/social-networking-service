const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
const HttpStatus = require('http-status-codes');
const notificationService = require('../services/notification');

exports.findById = (userId, select = 'name username followers following profileImageUrl privateAccount followRequests posts createdAt updatedAt') => {

    return new Promise((resolve, reject) => {

        User.findById(userId)
            .select(select)
            .then(user => {
                if (!user) {
                    const error = new Error("User doesn't with id: " + userId);
                    error.statusCode = HttpStatus.BAD_REQUEST;
                    reject(error);
                }
                resolve(user);
            })
            .catch(error => reject(error));
    });
}

exports.getModifiedUsers = (loggedUserId, inIds) => {

    return new Promise((resolve, reject) => {

        User.aggregate([
            { $match: { '_id': { $in: inIds } } },
            { $project: { username: 1, name: 1, profileImageUrl: 1, privateAccount: 1, followedByLoggedUser: { $in: [ObjectId(loggedUserId), "$followers"] }, requestedByLoggedUser: { $in: [ObjectId(loggedUserId), "$followRequests"] } } }
        ])
            .then(users => resolve(users))
            .catch(error => reject(error));
    });
}

exports.acceptFollowRequest = (follower, followee) => {

    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(followee, { $addToSet: { followers: follower }, $pull: { followRequests: follower } })
            .then(user => {
                if (!user) {
                    const error = new Error("Invalid User");
                    error.statusCode = HttpStatus.BAD_REQUEST;
                    reject(error);
                }
                return User.findByIdAndUpdate(follower, { $addToSet: { following: followee } });
            })
            .then(user => {
                return notificationService.createNotification('follow', follower, followee);
            })
            .then(notification => {
                resolve({ message: 'Followed user successfully!' });
            })
            .catch(error => {
                reject(error);
            })
    });
}

exports.rejectFollowRequests = (follower, followee) => {

    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(followee, { $pull: { followRequests: follower } })
            .then(user => {
                if (!user) {
                    const error = new Error("Invalid User");
                    error.statusCode = HttpStatus.BAD_REQUEST;
                    reject(error);
                }
                resolve({ message: 'Request cancelled successfully!' });
            })
            .catch(error => reject(error));
    });
}