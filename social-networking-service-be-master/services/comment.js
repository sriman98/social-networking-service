const Comment = require('../models/comment');

exports.findById = (commentId, select = 'comment postId createdUser createdAt updatedAt') => {

    return new Promise((resolve, reject) => {

        Comment.findById(commentId)
            .select(select)
            .then(comment => {
                if (!comment) {
                    const error = new Error('Invalid comment');
                    error.statusCode = HttpStatus.BAD_REQUEST;
                    reject(error);
                }
                resolve(comment);
            })
            .catch(error => reject(error));
    });
}