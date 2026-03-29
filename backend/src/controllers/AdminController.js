/**
 * Admin Controller - Admin dashboard operations
 */
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const TherapySession = require('../models/TherapySession');
const CreativePost = require('../models/CreativePost');
const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const parseNumber = (value) => Number.parseInt(value, 10) || 0;

class AdminController {
  static async getDashboardStats(req, res) {
    try {
      const [users, assessments, sessions, posts, latestActivity] = await Promise.all([
        User.countUsers(),
        db.get('SELECT COUNT(*) as count FROM assessments'),
        db.get('SELECT COUNT(*) as count FROM therapy_sessions'),
        db.get("SELECT COUNT(*) as count FROM creative_posts WHERE status = 'published'"),
        db.get(`
          SELECT MAX(last_activity_at) as last_activity_at
          FROM (
            SELECT MAX(created_at) as last_activity_at FROM users
            UNION ALL
            SELECT MAX(created_at) as last_activity_at FROM assessments
            UNION ALL
            SELECT MAX(created_at) as last_activity_at FROM therapy_sessions
            UNION ALL
            SELECT MAX(created_at) as last_activity_at FROM creative_posts
          )
        `)
      ]);

      return successResponse(res, 'Dashboard statistics', {
        users,
        assessments: parseNumber(assessments?.count),
        sessions: parseNumber(sessions?.count),
        posts: parseNumber(posts?.count),
        lastActivityAt: latestActivity?.last_activity_at || null,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getAllUsers(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const [users, count] = await Promise.all([
        User.getAllUsers(parseNumber(limit) || 50, parseNumber(offset)),
        User.countUsers()
      ]);

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

      const [assessments, sessions, posts] = await Promise.all([
        Assessment.getUserAssessments(userId, 5),
        TherapySession.getUserSessions(userId, 5),
        CreativePost.getUserPosts(userId, 5)
      ]);

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

      if (String(req.user.id) === String(userId)) {
        return errorResponse(res, 'You cannot delete your own admin account from this dashboard.', 400);
      }

      await User.deleteUser(userId);

      return successResponse(res, 'User deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getAssessmentStats(req, res) {
    try {
      const result = await db.all(`
        SELECT
          type,
          COUNT(*) as total,
          ROUND(AVG(total_score), 1) as avg_score,
          SUM(CASE WHEN severity = 'severe' THEN 1 ELSE 0 END) as severe_count,
          MAX(created_at) as latest_assessment_at
        FROM assessments
        GROUP BY type
        ORDER BY total DESC, type ASC
      `);

      return successResponse(res, 'Assessment statistics', result);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getSessionStats(req, res) {
    try {
      const result = await db.all(`
        SELECT
          status,
          COUNT(*) as total,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT therapist_id) as active_therapists
        FROM therapy_sessions
        GROUP BY status
        ORDER BY total DESC, status ASC
      `);

      return successResponse(res, 'Session statistics', result);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getPostStats(req, res) {
    try {
      const result = await db.all(`
        SELECT
          cp.type,
          COUNT(*) as total,
          COALESCE(SUM(cp.likes), 0) as total_likes,
          ROUND(AVG(cp.likes), 1) as avg_likes,
          COALESCE(SUM(comment_totals.comment_count), 0) as total_comments
        FROM creative_posts cp
        LEFT JOIN (
          SELECT post_id, COUNT(*) as comment_count
          FROM comments
          GROUP BY post_id
        ) comment_totals ON comment_totals.post_id = cp.id
        WHERE cp.status = 'published'
        GROUP BY cp.type
        ORDER BY total DESC, cp.type ASC
      `);

      return successResponse(res, 'Post statistics', result);
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

      const post = await CreativePost.getPostById(postId);
      if (!post) {
        return errorResponse(res, 'Post not found', 404);
      }

      const newStatus = action === 'approve' ? 'published' : 'archived';
      const updated = await CreativePost.updatePost(postId, { status: newStatus });

      return successResponse(res, `Content ${action}d`, updated);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getUserEngagementMetrics(req, res) {
    try {
      const result = await db.all(`
        SELECT
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          u.role,
          u.created_at,
          COALESCE(a.assessment_count, 0) as assessment_count,
          COALESCE(ts.session_count, 0) as session_count,
          COALESCE(cp.post_count, 0) as post_count,
          COALESCE(c.comment_count, 0) as comment_count,
          (
            COALESCE(a.assessment_count, 0) +
            COALESCE(ts.session_count, 0) * 2 +
            COALESCE(cp.post_count, 0) * 2 +
            COALESCE(c.comment_count, 0)
          ) as engagement_score
        FROM users u
        LEFT JOIN (
          SELECT user_id, COUNT(*) as assessment_count
          FROM assessments
          GROUP BY user_id
        ) a ON a.user_id = u.id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as session_count
          FROM therapy_sessions
          GROUP BY user_id
        ) ts ON ts.user_id = u.id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as post_count
          FROM creative_posts
          GROUP BY user_id
        ) cp ON cp.user_id = u.id
        LEFT JOIN (
          SELECT user_id, COUNT(*) as comment_count
          FROM comments
          GROUP BY user_id
        ) c ON c.user_id = u.id
        ORDER BY engagement_score DESC, u.created_at DESC
      `);

      return successResponse(res, 'User engagement metrics', result);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }
}

module.exports = AdminController;
