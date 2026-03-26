/**
 * Creative Post Routes
 */
const express = require('express');
const PostController = require('../controllers/PostController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Post CRUD
router.post('/', authMiddleware, PostController.createPost);
router.get('/', PostController.getAllPosts);
router.get('/:postId', PostController.getPostById);
router.get('/user/:userId', PostController.getUserPosts);
router.put('/:postId', authMiddleware, PostController.updatePost);
router.delete('/:postId', authMiddleware, PostController.deletePost);

// Post Interactions
router.post('/:postId/like', authMiddleware, PostController.likePost);
router.delete('/:postId/like', authMiddleware, PostController.unlikePost);
router.get('/:postId/stats', PostController.getPostStats);

// Comments
router.post('/:postId/comments', authMiddleware, PostController.createComment);
router.get('/:postId/comments', PostController.getPostComments);
router.put('/comments/:commentId', authMiddleware, PostController.updateComment);
router.delete('/comments/:commentId', authMiddleware, PostController.deleteComment);

module.exports = router;
