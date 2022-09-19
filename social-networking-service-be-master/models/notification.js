const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');

const Schema = mongoose.Schema;

const notificationSchema = Schema({
    type: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: Object,
        required: true,
        default: {}
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

notificationSchema.index({ sender: 1, receiver: 1 });

notificationSchema.post('save', { document: true }, async function () {
    if (this.content.postId) {
        await Post.findByIdAndUpdate(this.content.postId, { $addToSet: { notifications: this._id } });
    }
    await User.findByIdAndUpdate(this.receiver, { $addToSet: { notifications: this._id } });
});

notificationSchema.post('findOneAndDelete', async function (doc) {
    if (doc.content.postId) {
        await Post.findByIdAndUpdate(doc.content.postId, { $pull: { notifications: doc._id } });
    }
    await User.findByIdAndUpdate(doc.receiver, { $pull: { notifications: doc._id } });
});

module.exports = mongoose.model('Notification', notificationSchema);