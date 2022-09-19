const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const userService = require('../services/users');
const notificationService = require('../services/notification');
const HttpStatus = require('http-status-codes');
const postService = require('../services/post');
const hashtagService = require('../services/hashtag');
const hashtagUtil = require('../util/hashtag');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getPost = (req, res, next) => {

    const postId = req.params.postId;

    postService.getPosts(req.userId, '_id', [ObjectId(postId)])
        .then(posts => {
            res.status(HttpStatus.OK).json({ post: posts[0] });
        })
        .catch(error => next(error));
}

exports.addPost = (req, res, next) => {

    let loggedUser;
    let createdPost;

    userService.findById(req.userId)
        .then(user => {
            loggedUser = user;
            const post = new Post({
                content: req.body.postContent,
                createdUser: user._id,
                hashtags: hashtagUtil.getHashtagsArray(req.body.postContent)
            });
            return post.save();
        })
        .then(post => {
            createdPost = post;
            loggedUser.posts.push(post);
            return loggedUser.save();
        })
        .then(user => {
            return hashtagService.insertOrUpdateHashtags(createdPost._id, createdPost.hashtags);
        })
        .then(post => {
            post.createdUser = {
                name: loggedUser.name,
                username: loggedUser.username,
                profileImageUrl: loggedUser.profileImageUrl
            }
            res.status(HttpStatus.CREATED).json({ post: post });
        })
        .catch(error => {
            next(error);
        });
}

exports.getPosts = (req, res, next) => {

    userService.findById(req.userId, 'following')
        .then(user => {
            return postService.getPosts(req.userId, 'createdUser', user.following);
        })
        .then(posts => {
            res.status(HttpStatus.OK).json({ posts: posts });
        })
        .catch(error => {
            next(error);
        });
}

exports.getComments = (req, res, next) => {

    postService.findById(req.body.postId, 'comments')
        .then(post => {
            return Comment.find({ _id: { $in: post.comments } })
                .populate({ path: 'createdUser', select: 'name username profileImageUrl' })
                .sort({ createdAt: 'desc' });
        })
        .then(comments => res.status(HttpStatus.OK).json({ comments: comments }))
        .catch(error => next(error));
}

exports.likePost = (req, res, next) => {

    const loggedUser = req.userId;

    Post.findByIdAndUpdate(req.body.postId, { $addToSet: { likes: loggedUser } }, { new: true })
        .select('createdUser')
        .then(post => {
            if (!post) {
                const error = new Error('Invalid post');
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }
            if (loggedUser !== post.createdUser.toString()) {
                const content = {
                    postId: post._id
                }
                return notificationService.createNotification('like', loggedUser, post.createdUser, content);
            } else {
                return Promise.resolve('');
            }
        })
        .then(response => {
            res.status(HttpStatus.OK).json({ message: 'Post liked successfully' });
        })
        .catch(error => {
            next(error);
        })
}

exports.unlikePost = (req, res, next) => {

    const loggedUser = req.userId;

    Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: loggedUser } }, { new: true })
        .select('createdUser')
        .then(post => {
            if (!post) {
                const error = new Error('Invalid post');
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }
            if (loggedUser !== post.createdUser.toString()) {
                return notificationService.deleteNotification('like', loggedUser, post.createdUser, post._id);
            } else {
                return Promise.resolve('');
            }
        })
        .then(response => {
            res.status(HttpStatus.OK).json({ message: 'Post unliked successfully' });
        })
        .catch(error => {
            next(error);
        })
}

exports.updatePost = (req, res, next) => {

    const postId = req.params.postId;

    let updatedPost;
    let existingHashtags = [];

    postService.findById(postId)
        .then(post => {
            if (post.createdUser._id.toString() !== req.userId) {
                const error = new Error('Access denied!');
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }
            existingHashtags = post.hashtags;
            post.content = req.body.postContent;
            post.hashtags = hashtagUtil.getHashtagsArray(req.body.postContent);
            return post.save();
        })
        .then(post => {
            updatedPost = post;
            return hashtagService.insertOrDeletePostsHashtags(updatedPost._id, updatedPost.hashtags, existingHashtags);
        })
        .then(response => {
            return Post.populate(updatedPost, { path: 'createdUser', select: 'name username profileImageUrl' });
        })
        .then(post => {
            res.status(HttpStatus.OK).json({ post: updatedPost });
        })
        .catch(error => {
            next(error);
        });
}

exports.deletePost = (req, res, next) => {

    const postId = req.params.postId;

    let deletedPost;

    postService.findById(postId)
        .then(post => {
            if (post.createdUser._id.toString() !== req.userId) {
                const error = new Error('Access denied!');
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }
            return post.deleteOne();
        })
        .then(post => {
            deletedPost = post;
            return User.findByIdAndUpdate(post.createdUser._id, { $pull: { posts: post._id } });
        })
        .then(user => {
            return hashtagService.removePostsHashtags(deletedPost._id, deletedPost.hashtags);
        })
        .then(response => {
            res.status(HttpStatus.OK).json({ postId: postId, message: 'Post deleted successfully!' });
        })
        .catch(error => {
            next(error);
        })
}

exports.getLikes = (req, res, next) => {

    const postId = req.params.postId;

    postService.findById(postId, 'likes')
        .then(post => {
            return userService.getModifiedUsers(req.userId, post.likes);
        })
        .then(users => {
            res.status(HttpStatus.OK).json({ users: users });
        })
        .catch(error => {
            next(error);
        });
}