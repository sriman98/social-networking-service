const Comment = require('../models/comment');
const userService = require('../services/users');
const postService = require('../services/post');
const commentService = require('../services/comment');
const notificationService = require('../services/notification');
const Post = require('../models/post');
const HttpStatus = require('http-status-codes');

exports.addComment = (req, res, next) => {

    let createdComment;
    let respectivePost;
    let createdUser = req.userId;

    postService.findById(req.body.postId)
        .then(post => {
            respectivePost = post;
            const comment = new Comment({
                comment: req.body.comment,
                postId: respectivePost._id,
                createdUser: createdUser
            });
            return comment.save();
        })
        .then(comment => {
            createdComment = comment;
            respectivePost.comments.push(comment._id);
            return respectivePost.save();
        })
        .then(post => {
            return notificationService.createNotification('comment', createdUser, post.createdUser, { postId: post._id, commentId: createdComment._id });
        })
        .then(response => {
            return Comment.populate(createdComment, { path: 'createdUser', select: 'name username profileImageUrl' });
        })
        .then(comment => {
            res.status(HttpStatus.CREATED).json({ comment: comment });
        })
        .catch(error => {
            next(error);
        });
}

exports.updateComment = (req, res, next) => {

    const commentId = req.params.commentId;

    commentService.findById(commentId)
        .then(comment => {
            if (comment.createdUser._id.toString() !== req.userId) {
                const error = new Error('Access denied!');
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }
            comment.comment = req.body.comment;
            return comment.save();
        })
        .then(comment => {
            return Comment.populate(comment, { path: 'createdUser', select: 'name username profileImageUrl' });
        })
        .then(comment => {
            res.status(HttpStatus.OK).json({ comment: comment });
        })
        .catch(error => {
            next(error);
        });
}

exports.deleteComment = (req, res, next) => {

    const commentId = req.params.commentId;
    let toDeleteComment = null;

    Comment.findById(commentId)
        .populate('postId', 'createdUser')
        .then(comment => {
            if (!comment) {
                const error = new Error('Invalid comment');
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }
            toDeleteComment = comment;
            if (comment.createdUser._id.toString() !== req.userId && comment.postId.createdUser._id.toString() !== req.userId) {
                const error = new Error('Access denied!');
                error.statusCode = HttpStatus.BAD_REQUEST;
                throw error;
            }
            return comment.deleteOne();
        })
        .then(comment => {
            return Post.findByIdAndUpdate(comment.postId._id, { $pull: { comments: comment._id } });
        })
        .then(post => {
            return notificationService.deleteNotification('comment', toDeleteComment.createdUser, post.createdUser, post._id, toDeleteComment._id);
        })
        .then(response => {
            res.status(HttpStatus.OK).json({ commentId: commentId, message: 'Comment deleted successfully!' });
        })
        .catch(error => {
            next(error);
        });
}