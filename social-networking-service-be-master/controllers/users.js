const User = require('../models/user');
const HttpStatus = require('http-status-codes');
const userService = require('../services/users');
const postService = require('../services/post');
const ObjectId = require('mongoose').Types.ObjectId;
const fs = require('fs');
const notificationService = require('../services/notification');

exports.getUserByToken = (req, res, next) => {

    const userId = req.userId;

    userService.findById(userId, 'name username profileImageUrl privateAccount')
        .then(user => {
            res.status(HttpStatus.OK).json(user);
        })
        .catch(error => {
            next(error);
        });
}

exports.getUsers = (req, res, next) => {

    User.find({
        $or:
            [
                { "name": { "$regex": req.query.search, "$options": "i" } },
                { "username": { "$regex": req.query.search, "$options": "i" } }
            ]
    })
        .select('name username profileImageUrl')
        .then(users => {
            res.status(HttpStatus.OK).json({ users: users });
        })
        .catch(error => {
            next(error);
        });
}

exports.getUserById = (req, res, next) => {

    const userId = req.params.id;
    let responseUser;

    User.aggregate([
        { $match: { _id: ObjectId(userId) } },
        { $addFields: { followers_count: { $size: "$followers" }, following_count: { $size: "$following" }, followedByLoggedUser: { $in: [ObjectId(req.userId), "$followers"] }, requestedByLoggedUser: { $in: [ObjectId(req.userId), "$followRequests"] } } },
        { $project: { username: 1, name: 1, profileImageUrl: 1, privateAccount: 1, posts: { $cond: { if: { $and: [{ $ne: ["$_id", ObjectId(req.userId)] }, { $eq: ["$privateAccount", true] }, { $eq: ["$followedByLoggedUser", false] }] }, then: [], else: "$posts" } }, followers_count: 1, following_count: 1, followedByLoggedUser: 1, requestedByLoggedUser: 1 } }
    ])
        .then(users => {
            if (!users[0]) {
                const error = new Error("Invalid User");
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }
            responseUser = users[0];
            if (responseUser.posts.length === 0) {
                return Promise.resolve([]);
            }
            return postService.getPosts(req.userId, '_id', responseUser.posts);
        })
        .then(posts => {
            responseUser.posts = posts;
            res.status(HttpStatus.OK).json({ user: responseUser });
        })
        .catch(error => {
            next(error);
        });
}

exports.updateUser = (req, res, next) => {

    userService.findById(req.userId, 'name username profileImageUrl')
        .then(user => {
            user.name = req.body.name;
            if (req.body.profileImageUrl !== undefined) {
                if (user.profileImageUrl) {
                    fs.unlink(user.profileImageUrl, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                user.profileImageUrl = req.body.profileImageUrl;
            }
            return user.save();
        })
        .then(user => {
            res.status(HttpStatus.OK).json({ user: user });
        })
        .catch(error => next(error));
}

exports.updatePrivacySettings = (req, res, next) => {

    userService.findById(req.userId, 'name username profileImageUrl privateAccount')
        .then(user => {
            if (req.body.privateAccount !== undefined) {
                user.privateAccount = req.body.privateAccount;
            }
            return user.save();
        })
        .then(user => {
            res.status(HttpStatus.OK).json({ user: user });
        })
        .catch(error => next(error));
}

exports.getRequestedUsers = (req, res, next) => {

    userService.findById(req.userId, 'followRequests')
        .then(user => {
            return User.populate(user, { path: 'followRequests', select: 'name username profileImageUrl' });
        })
        .then(user => {
            res.status(HttpStatus.OK).json({ users: user.followRequests });
        })
        .catch(error => next(error));
}

exports.followUser = (req, res, next) => {

    const followee = req.body.userId;
    const follower = req.userId;

    userService.findById(followee)
        .then(followee => {
            if (followee.privateAccount) {
                return User.findByIdAndUpdate(followee._id, { $addToSet: { followRequests: follower } });
            } else {
                return userService.acceptFollowRequest(follower, followee);
            }
        })
        .then(response => {
            res.status(HttpStatus.OK).json({ message: 'Followed/Requested successfully!' });
        })
        .catch(error => next(error));
}

exports.acceptFollowRequest = (req, res, next) => {

    const follower = req.body.userId;
    const followee = req.userId;

    userService.acceptFollowRequest(follower, followee)
        .then(response => {
            return notificationService.createNotification('accept_follow_request', followee, follower);
        })
        .then(response => {
            res.status(HttpStatus.OK).json({ message: 'Request accepted successfully!' });
        })
        .catch(error => next(error));
}

exports.cancelFollowRequest = (req, res, next) => {

    const followee = req.body.userId;
    const follower = req.userId;

    userService.rejectFollowRequests(follower, followee)
        .then(response => {
            res.status(HttpStatus.OK).json({ message: 'Request cancelled successfully!' });
        })
        .catch(error => next(error));
}

exports.rejectFollowRequest = (req, res, next) => {

    const followee = req.userId;
    const follower = req.body.userId;

    userService.rejectFollowRequests(follower, followee)
        .then(response => {
            res.status(HttpStatus.OK).json({ message: 'Request cancelled successfully!' });
        })
        .catch(error => next(error));
}

exports.unfollowUser = (req, res, next) => {

    const followee = req.body.userId;
    const follower = req.userId;

    User.findByIdAndUpdate(followee, { $pull: { followers: follower } }, { new: true })
        .select('username name')
        .then(user => {
            if (!user) {
                const error = new Error("Invalid User");
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }
            return User.findByIdAndUpdate(follower, { $pull: { following: followee } });
        })
        .then(user => {
            return notificationService.deleteNotification('follow', follower, followee);
        })
        .then(response => {
            res.status(HttpStatus.OK).json({ message: 'Unfollowed user successfully!' });
        })
        .catch(error => {
            next(error);
        })
}

exports.getFollowingUsers = (req, res, next) => {

    const userId = req.params.userId;

    userService.findById(userId, 'following')
        .then(user => {
            return userService.getModifiedUsers(req.userId, user.following);
        })
        .then(users => {
            res.status(HttpStatus.OK).json({ users: users });
        })
        .catch(error => {
            next(error);
        });
}

exports.getFollowers = (req, res, next) => {

    const userId = req.params.userId;

    userService.findById(userId, 'followers')
        .then(user => {
            return userService.getModifiedUsers(req.userId, user.followers)
        })
        .then(users => {
            res.status(HttpStatus.OK).json({ users: users });
        })
        .catch(error => {
            next(error);
        });
}

exports.getSuggestions = (req, res, next) => {

    userService.findById(req.userId, 'following')
        .then(user => {
            return User.find({ _id: { $in: user.following } }).select('following');
        })
        .then(users => {
            const suggestedUserIds = new Set();
            users.forEach(user => {
                user.following.map(each => suggestedUserIds.add(each._id));
            });
            return User.find({
                $and: [
                    { _id: { $in: [...suggestedUserIds] } },
                    { _id: { $ne: req.userId } },
                    { followers: { $nin: [req.userId] } },
                    { followRequests: { $nin: [req.userId] } }
                ]
            }).select('name username profileImageUrl privateAccount');
        })
        .then(users => {
            res.status(HttpStatus.OK).json({ users: users });
        })
        .catch(error => next(error));
}