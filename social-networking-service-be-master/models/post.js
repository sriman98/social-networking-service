const mongoose = require('mongoose');
const Comment = require('./comment');

const Schema = mongoose.Schema;

const postSchema = Schema({
    content: {
        type: String,
        required: true
    },
    createdUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    hashtags: [
        {
            type: String,
            ref: 'Hashtag'
        }
    ],
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ]
}, { timestamps: true });

postSchema.pre('deleteOne', { document: true }, async function () {
    await Comment.deleteMany({ '_id': { $in: this.comments } });
});

module.exports = mongoose.model('Post', postSchema);