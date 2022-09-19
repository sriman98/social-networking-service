const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hashtagSchema = Schema({
    _id: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 1,
        required: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Hashtag', hashtagSchema);