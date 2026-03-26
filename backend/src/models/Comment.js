/**
 * Comment Model - Comments on creative posts
 */
const pool = require('../config/database');

class Comment {
  static async create(commentData) {
    const { postId, userId, content } = commentData;
    
    const query = `
      INSERT INTO comments (post_id, user_id, content, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, post_id, user_id, content, created_at
    `;
    
    const result = await pool.query(query, [postId, userId, content]);
    return result.rows[0];
  }

  static async getPostComments(postId, limit = 50, offset = 0) {
    const query = `
      SELECT 
        c.id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at,
        u.first_name, u.last_name, u.profile_image
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = $1
      ORDER BY c.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [postId, limit, offset]);
    return result.rows;
  }

  static async getCommentById(commentId) {
    const query = `
      SELECT 
        c.id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at,
        u.first_name, u.last_name
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = $1
    `;
    
    const result = await pool.query(query, [commentId]);
    return result.rows[0] || null;
  }

  static async updateComment(commentId, content) {
    const query = `
      UPDATE comments
      SET content = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, content, updated_at
    `;
    
    const result = await pool.query(query, [content, commentId]);
    return result.rows[0] || null;
  }

  static async deleteComment(commentId) {
    const query = `DELETE FROM comments WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [commentId]);
    return result.rows[0] || null;
  }

  static async countPostComments(postId) {
    const query = `SELECT COUNT(*) as count FROM comments WHERE post_id = $1`;
    const result = await pool.query(query, [postId]);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Comment;
