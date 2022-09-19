const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = Schema({
    comment: {
        type: String,
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    createdUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);