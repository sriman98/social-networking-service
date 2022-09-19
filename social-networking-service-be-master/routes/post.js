const express = require('express');

const router = express.Router();

const postController = require('../controllers/post');
const postValidator = require('../validators/post');
const isAuth = require('../middleware/isAuth');

router.post('/posts', isAuth, postValidator.addPost, postController.addPost);

router.get('/posts', isAuth, postController.getPosts);

router.post('/posts/like', isAuth, postValidator.likePost, postController.likePost);

router.post('/posts/unlike', isAuth, postValidator.likePost, postController.unlikePost);

router.post('/posts/comments', isAuth, postValidator.likePost, postController.getComments);

router.delete('/posts/:postId', isAuth, postController.deletePost);

router.put('/posts/:postId', isAuth, postValidator.addPost, postController.updatePost);

router.get('/posts/:postId/likes', isAuth, postController.getLikes);

router.get('/posts/:postId', isAuth, postController.getPost);

module.exports = router;