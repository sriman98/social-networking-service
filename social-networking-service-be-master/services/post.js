const ObjectId = require('mongoose').Types.ObjectId;
const Post = require('../models/post');

exports.findById = (postId, select = 'content createdUser likes comments hashtags createdAt updatedAt') => {

    return new Promise((resolve, reject) => {

        Post.findById(postId)
            .select(select)
            .then(post => {
                if (!post) {
                    const error = new Error('Invalid post');
                    error.statusCode = HttpStatus.BAD_REQUEST;
                    reject(error);
                }
                resolve(post);
            })
            .catch(error => reject(error));
    });
}

exports.getPosts = (userId, matchEl, inIds) => {

    return new Promise((resolve, reject) => {

        Post.aggregate([
            { $match: { [matchEl]: { $in: inIds } } },
            { $project: { content: 1, createdUser: 1, createdAt: 1, likes_count: { $size: "$likes" }, comments_count: { $size: "$comments" }, likedByLoggedUser: { $in: [ObjectId(userId), "$likes"] } } },
            { $sort: { createdAt: -1 } }
        ])
            .then(posts => Post.populate(posts, { path: 'createdUser', select: 'name username profileImageUrl' }))
            .then(posts => resolve(posts))
            .catch(error => reject(error));
    });
}