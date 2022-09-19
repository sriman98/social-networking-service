const express = require('express');

const router = express.Router();

const commentController = require('../controllers/comment');
const commentValidator = require('../validators/comment');
const isAuth = require('../middleware/isAuth');

router.post('/comments', isAuth, commentValidator.addComment, commentController.addComment);

router.delete('/comments/:commentId', isAuth, commentController.deleteComment);

router.put('/comments/:commentId', isAuth, commentValidator.updateComment, commentController.updateComment);

module.exports = router;