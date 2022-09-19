const express = require('express');

const router = express.Router();

const hashtagController = require('../controllers/hashtag');
const isAuth = require('../middleware/isAuth');

router.get('/hashtags/trending', isAuth, hashtagController.getTrendingHashtags);

router.get('/hashtags/:hashtag', isAuth, hashtagController.getHashtagPosts);

module.exports = router;