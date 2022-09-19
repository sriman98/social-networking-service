const HttpStatus = require('http-status-codes');
const hashtagService = require('../services/hashtag');
const postService = require('../services/post');
const Hashtag = require('../models/hashtag');

exports.getHashtagPosts = (req, res, next) => {

    const hashtag = req.params.hashtag;

    hashtagService.getHashtag(hashtag, 'posts')
        .then(hashtag => {
            return postService.getPosts(req.userId, '_id', hashtag.posts);
        })
        .then(posts => {
            res.status(HttpStatus.OK).json({ posts: posts });
        })
        .catch(error => next(error));
}

exports.getTrendingHashtags = (req, res, next) => {

    Hashtag.find({})
        .select('count')
        .sort({ count: 'desc', updatedAt: 'desc' })
        .limit(10)
        .then(hashtags => {
            res.status(HttpStatus.OK).json({ hashtags: hashtags });
        })
        .catch(error => next(error));
}

