/**
 * Creative Post Controller - Handle post creation and interaction
 */
const CreativePost = require('../models/CreativePost');
const Comment = require('../models/Comment');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class PostController {
  static async createPost(req, res) {
    try {
      const { title, content, type, thumbnail } = req.body;

      if (!title || !content || !type) {
        return errorResponse(res, 'Title, content, and type are required', 400);
      }

      const validTypes = ['story', 'art', 'creative', 'inspiration', 'question'];
      if (!validTypes.includes(type)) {
        return errorResponse(res, `Type must be one of: ${validTypes.join(', ')}`, 400);
      }

      const post = await CreativePost.create({
        userId: req.user.id,
        title,
        content,
        type,
        thumbnail,
        status: 'published'
      });

      return successResponse(res, 'Post created successfully', post, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getPostById(req, res) {
    try {
      const { postId } = req.params;

      const post = await CreativePost.getPostById(postId);
      if (!post) {
        return errorResponse(res, 'Post not found', 404);
      }

      return successResponse(res, 'Post retrieved', post);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getAllPosts(req, res) {
    try {
      const { type, limit = 20, offset = 0 } = req.query;

      const posts = await CreativePost.getAllPosts(type, parseInt(limit), parseInt(offset));

      return successResponse(res, 'Posts retrieved', { posts, count: posts.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getUserPosts(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 20, offset = 0 } = req.query;

      const posts = await CreativePost.getUserPosts(userId, parseInt(limit), parseInt(offset));

      return successResponse(res, 'User posts retrieved', { posts, count: posts.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async updatePost(req, res) {
    try {
      const { postId } = req.params;
      const { title, content, status } = req.body;

      const post = await CreativePost.getPostById(postId);
      if (!post) {
        return errorResponse(res, 'Post not found', 404);
      }

      if (post.user_id !== req.user.id && req.user.role !== 'admin') {
        return errorResponse(res, 'Access denied', 403);
      }

      const updated = await CreativePost.updatePost(postId, { title, content, status });

      return successResponse(res, 'Post updated successfully', updated);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async deletePost(req, res) {
    try {
      const { postId } = req.params;

      const post = await CreativePost.getPostById(postId);
      if (!post) {
        return errorResponse(res, 'Post not found', 404);
      }

      if (post.user_id !== req.user.id && req.user.role !== 'admin') {
        return errorResponse(res, 'Access denied', 403);
      }

      await CreativePost.deletePost(postId);

      return successResponse(res, 'Post deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async likePost(req, res) {
    try {
      const { postId } = req.params;

      const post = await CreativePost.getPostById(postId);
      if (!post) {
        return errorResponse(res, 'Post not found', 404);
      }

      const result = await CreativePost.likePost(postId, req.user.id);

      return successResponse(res, result.message, result);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async unlikePost(req, res) {
    try {
      const { postId } = req.params;

      const post = await CreativePost.getPostById(postId);
      if (!post) {
        return errorResponse(res, 'Post not found', 404);
      }

      const result = await CreativePost.unlikePost(postId, req.user.id);

      return successResponse(res, 'Post unliked', result);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async createComment(req, res) {
    try {
      const { postId } = req.params;
      const { content } = req.body;

      if (!content) {
        return errorResponse(res, 'Comment content is required', 400);
      }

      const post = await CreativePost.getPostById(postId);
      if (!post) {
        return errorResponse(res, 'Post not found', 404);
      }

      const comment = await Comment.create({
        postId,
        userId: req.user.id,
        content
      });

      return successResponse(res, 'Comment created', comment, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getPostComments(req, res) {
    try {
      const { postId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const comments = await Comment.getPostComments(postId, parseInt(limit), parseInt(offset));

      return successResponse(res, 'Comments retrieved', { comments, count: comments.length });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { content } = req.body;

      const comment = await Comment.getCommentById(commentId);
      if (!comment) {
        return errorResponse(res, 'Comment not found', 404);
      }

      if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
        return errorResponse(res, 'Access denied', 403);
      }

      const updated = await Comment.updateComment(commentId, content);

      return successResponse(res, 'Comment updated', updated);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async deleteComment(req, res) {
    try {
      const { commentId } = req.params;

      const comment = await Comment.getCommentById(commentId);
      if (!comment) {
        return errorResponse(res, 'Comment not found', 404);
      }

      if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
        return errorResponse(res, 'Access denied', 403);
      }

      await Comment.deleteComment(commentId);

      return successResponse(res, 'Comment deleted');
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getPostStats(req, res) {
    try {
      const { postId } = req.params;

      const stats = await CreativePost.getPostStats(postId);
      if (!stats) {
        return errorResponse(res, 'Post not found', 404);
      }

      return successResponse(res, 'Post statistics retrieved', stats);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }
}

module.exports = PostController;
