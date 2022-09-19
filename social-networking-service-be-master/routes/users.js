const express = require('express');
const userController = require('../controllers/users');
const userValidator = require('../validators/user');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/users/token', isAuth, userController.getUserByToken);

router.get('/users/suggestions', isAuth, userController.getSuggestions);

router.get('/users/requests', isAuth, userController.getRequestedUsers);

router.get('/users', isAuth, userController.getUsers);

router.get('/users/:id', isAuth, userController.getUserById);

router.post('/users/follow', isAuth, userValidator.followUser, userController.followUser);

router.post('/users/unfollow', isAuth, userValidator.followUser, userController.unfollowUser);

router.post('/users/cancelrequest', isAuth, userValidator.followUser, userController.cancelFollowRequest);

router.post('/users/acceptrequest', isAuth, userValidator.followUser, userController.acceptFollowRequest);

router.post('/users/rejectrequest', isAuth, userValidator.followUser, userController.rejectFollowRequest);

router.post('/users/privacysettings', isAuth, userController.updatePrivacySettings);

router.get('/users/:userId/following', isAuth, userController.getFollowingUsers);

router.get('/users/:userId/followers', isAuth, userController.getFollowers);

router.put('/users', isAuth, userValidator.updateUser, userController.updateUser);

module.exports = router;