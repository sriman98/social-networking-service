const Notification = require('../models/notification');

exports.createNotification = (type, sender, receiver, content = {}) => {

    return new Promise((resolve, reject) => {
        const notification = new Notification({
            type: type,
            sender: sender,
            receiver: receiver,
            content: content
        });
        notification.save()
            .then(notification => resolve(notification))
            .catch(error => reject(error));
    });
}

exports.deleteNotification = (type, sender, receiver, postId = null, commentId = null) => {

    return new Promise((resolve, reject) => {
        let query = null;
        if (postId !== null && commentId !== null) {
            query = Notification.findOneAndDelete({ type: type, sender: sender, receiver: receiver, 'content.postId': postId, 'content.commentId': commentId });
        } else if (postId !== null) {
            query = Notification.findOneAndDelete({ type: type, sender: sender, receiver: receiver, 'content.postId': postId });
        } else {
            query = Notification.findOneAndDelete({ type: type, sender: sender, receiver: receiver });
        }
        query.then(response => resolve(response)).catch(error => reject(error));
    });
}