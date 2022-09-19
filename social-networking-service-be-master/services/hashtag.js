const hashtagUtil = require('../util/hashtag');
const Hashtag = require('../models/hashtag');

exports.getHashtag = (hashtag, select = 'count posts createdAt updatedAt') => {

    return new Promise((resolve, reject) => {

        Hashtag.findById(hashtag)
            .select(select)
            .then(hashtag => {
                if (!hashtag) {
                    const error = new Error('Invalid Hashtag');
                    error.statusCode = HttpStatus.BAD_REQUEST;
                    reject(error);
                }
                resolve(hashtag);
            })
            .catch(error => reject(error));
    });
}

exports.insertOrUpdateHashtags = (postId, hashtagsArray) => {

    return new Promise((resolve, reject) => {

        const promises = hashtagsArray.map(hashtag => Hashtag.findByIdAndUpdate(hashtag, { $inc: { count: 1 }, $addToSet: { posts: postId } }, { upsert: true }));

        Promise.all(promises)
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

exports.removePostsHashtags = (postId, hashtagsArray) => {

    return new Promise((resolve, reject) => {

        Hashtag.updateMany(
            { _id: { $in: hashtagsArray } },
            { $pull: { posts: postId } },
            { multi: true }
        )
            .then(response => resolve(response))
            .catch(error => reject(error));
    });
}

exports.insertOrDeletePostsHashtags = (postId, hashtagsArray, existingHashtags) => {

    return new Promise((resolve, reject) => {

        const splitArrays = hashtagUtil.splitIntoNonIntersectionArrays(hashtagsArray, existingHashtags);

        if (splitArrays.dbExtraArray.length === 0 && splitArrays.apiExtraArray.length === 0) {
            resolve(true);
        } else {
            this.insertOrUpdateHashtags(postId, splitArrays.apiExtraArray)
                .then(response => {
                    return this.removePostsHashtags(postId, splitArrays.dbExtraArray);
                })
                .then(response => resolve(response))
                .catch(error => reject(error));
        }
    });
}