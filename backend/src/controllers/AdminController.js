/**
 * Admin Controller - Admin dashboard operations
 */
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const TherapySession = require('../models/TherapySession');
const CreativePost = require('../models/CreativePost');
const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class AdminController {
  static async getDashboardStats(req, res) {
    try {
      const userCount = await User.countUsers();

      const assessmentResult = await db.get('SELECT COUNT(*) as count FROM assessments');
      const assessmentCount = parseInt(assessmentResult.count);

      const sessionResult = await db.get('SELECT COUNT(*) as count FROM therapy_sessions');
      const sessionCount = parseInt(sessionResult.count);

      const postResult = await db.get('SELECT COUNT(*) as count FROM creative_posts WHERE status = \'published\'');
      const postCount = parseInt(postResult.count);

      const stats = {
        users: userCount,
        assessments: assessmentCount,
        sessions: sessionCount,
        posts: postCount,
        timestamp: new Date().toISOString()
      };

      return successResponse(res, 'Dashboard statistics', stats);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getAllUsers(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const users = await User.getAllUsers(parseInt(limit), parseInt(offset));
      const count = await User.countUsers();

      return successResponse(res, 'All users retrieved', { users, count });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getUserDetails(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      const assessments = await Assessment.getUserAssessments(userId, 5);
      const sessions = await TherapySession.getUserSessions(userId, 5);
      const posts = await CreativePost.getUserPosts(userId, 5);

      return successResponse(res, 'User details retrieved', {
        user,
        assessments,
        sessions,
        posts
      });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      await User.deleteUser(userId);

      return successResponse(res, 'User deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getAssessmentStats(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          type,
          COUNT(*) as total,
          AVG(total_score) as avg_score,
          severity,
          COUNT(CASE WHEN severity = 'severe' THEN 1 END) as severe_count
        FROM assessments
        GROUP BY type, severity
      `);

      return successResponse(res, 'Assessment statistics', result.rows);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getSessionStats(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          status,
          COUNT(*) as total,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT therapist_id) as active_therapists
        FROM therapy_sessions
        GROUP BY status
      `);

      return successResponse(res, 'Session statistics', result.rows);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getPostStats(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          type,
          COUNT(*) as total,
          SUM(likes) as total_likes,
          AVG(likes) as avg_likes,
          (SELECT COUNT(*) FROM comments c WHERE c.post_id = cp.id) as total_comments
        FROM creative_posts cp
        WHERE status = 'published'
        GROUP BY type
      `);

      return successResponse(res, 'Post statistics', result.rows);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async moderateContent(req, res) {
    try {
      const { postId, action } = req.body;

      if (!['approve', 'reject', 'archive'].includes(action)) {
        return errorResponse(res, 'Invalid action', 400);
      }

      let newStatus = action === 'reject' ? 'archived' : action === 'approve' ? 'published' : 'archived';
      const updated = await CreativePost.updatePost(postId, { status: newStatus });

      return successResponse(res, `Content ${action}ed`, updated);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getUserEngagementMetrics(req, res) {
    try {
      const result = await pool.query(`
        SELECT 
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          COUNT(DISTINCT a.id) as assessment_count,
          COUNT(DISTINCT ts.id) as session_count,
          COUNT(DISTINCT cp.id) as post_count,
          COUNT(DISTINCT c.id) as comment_count
        FROM users u
        LEFT JOIN assessments a ON u.id = a.user_id
        LEFT JOIN therapy_sessions ts ON u.id = ts.user_id
        LEFT JOIN creative_posts cp ON u.id = cp.user_id
        LEFT JOIN comments c ON u.id = c.user_id
        GROUP BY u.id, u.email, u.first_name, u.last_name
        ORDER BY u.created_at DESC
      `);

      return successResponse(res, 'User engagement metrics', result.rows);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }
}

module.exports = AdminController;
