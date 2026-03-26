/**
 * Comment Model - Comments on creative posts
 */
const db = require('../config/database');

class Comment {
  static async create(commentData) {
    const { postId, userId, content } = commentData;

    const query = `
      INSERT INTO comments (post_id, user_id, content, created_at, updated_at)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `;

    const result = await db.run(query, [postId, userId, content]);

    // Get the created comment
    const comment = await db.get(`
      SELECT
        c.id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at,
        u.first_name, u.last_name, u.profile_image
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
    `, [result.id]);

    return comment;
  }

  static async getPostComments(postId, limit = 50, offset = 0) {
    const query = `
      SELECT
        c.id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at,
        u.first_name, u.last_name, u.profile_image
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await db.all(query, [postId, limit, offset]);
    return result;
  }

  static async getCommentById(commentId) {
    const query = `
      SELECT
        c.id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at,
        u.first_name, u.last_name
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
    `;

    const result = await db.get(query, [commentId]);
    return result || null;
  }

  static async updateComment(commentId, content) {
    const query = `
      UPDATE comments
      SET content = ?, updated_at = datetime('now')
      WHERE id = ?
    `;

    await db.run(query, [content, commentId]);

    // Get updated comment
    const comment = await db.get('SELECT id, content, updated_at FROM comments WHERE id = ?', [commentId]);
    return comment || null;
  }

  static async deleteComment(commentId) {
    const query = `DELETE FROM comments WHERE id = ?`;
    const result = await db.run(query, [commentId]);
    return result.changes > 0 ? { id: commentId } : null;
  }

  static async countPostComments(postId) {
    const query = `SELECT COUNT(*) as count FROM comments WHERE post_id = ?`;
    const result = await db.get(query, [postId]);
    return parseInt(result.count);
  }
}

module.exports = Comment;
