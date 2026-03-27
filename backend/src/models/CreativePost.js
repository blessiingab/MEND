/**
 * CreativePost Model - Stories and Art posts
 */
const db = require('../config/database');

class CreativePost {
  static async create(postData) {
    const { userId, title, content, type, thumbnail, status = 'published' } = postData;

    const query = `
      INSERT INTO creative_posts (user_id, title, content, type, thumbnail, status, likes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))
    `;

    const result = await db.run(query, [userId, title, content, type, thumbnail, status]);

    // Get the created post
    const post = await db.get('SELECT id, user_id, title, content, type, status, likes, created_at FROM creative_posts WHERE id = ?', [result.id]);
    return post;
  }

  static async getPostById(postId) {
    const query = `
      SELECT
        cp.id, cp.user_id, cp.title, cp.content, cp.type, cp.thumbnail,
        cp.status, cp.likes, cp.created_at, cp.updated_at,
        (
          SELECT COUNT(*)
          FROM comments c
          WHERE c.post_id = cp.id
        ) as comments_count,
        u.first_name, u.last_name, u.email
      FROM creative_posts cp
      JOIN users u ON u.id = cp.user_id
      WHERE cp.id = ?
    `;

    const result = await db.get(query, [postId]);
    return result || null;
  }

  static async getUserPosts(userId, limit = 20, offset = 0) {
    const query = `
      SELECT id, user_id, title, content, type, thumbnail, status, likes, created_at
      FROM creative_posts
      WHERE user_id = ? AND status = 'published'
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await db.all(query, [userId, limit, offset]);
    return result;
  }

  static async getAllPosts(type = null, limit = 20, offset = 0) {
    let query = `
      SELECT
        cp.id, cp.user_id, cp.title, cp.content, cp.type, cp.thumbnail,
        cp.likes, cp.created_at,
        (
          SELECT COUNT(*)
          FROM comments c
          WHERE c.post_id = cp.id
        ) as comments_count,
        u.first_name, u.last_name
      FROM creative_posts cp
      JOIN users u ON u.id = cp.user_id
      WHERE cp.status = 'published'
    `;

    const params = [];

    if (type) {
      query += ` AND cp.type = ?`;
      params.push(type);
    }

    query += ` ORDER BY cp.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const result = await db.all(query, params);
    return result;
  }

  static async likePost(postId, userId) {
    const checkQuery = `SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?`;
    const checkResult = await db.get(checkQuery, [postId, userId]);

    if (checkResult) {
      return { liked: false, message: 'Already liked' };
    }

    const likeQuery = `INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)`;
    await db.run(likeQuery, [postId, userId]);

    const updateQuery = `
      UPDATE creative_posts
      SET likes = likes + 1
      WHERE id = ?
    `;

    await db.run(updateQuery, [postId]);

    // Get updated likes count
    const post = await db.get('SELECT likes FROM creative_posts WHERE id = ?', [postId]);
    return { liked: true, likes: post.likes };
  }

  static async unlikePost(postId, userId) {
    const deleteQuery = `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?`;
    await db.run(deleteQuery, [postId, userId]);

    const updateQuery = `
      UPDATE creative_posts
      SET likes = likes - 1
      WHERE id = ?
    `;

    await db.run(updateQuery, [postId]);

    // Get updated likes count
    const post = await db.get('SELECT likes FROM creative_posts WHERE id = ?', [postId]);
    return { liked: false, likes: post.likes };
  }

  static async updatePost(postId, updates) {
    const { title, content, status } = updates;

    const query = `
      UPDATE creative_posts
      SET title = COALESCE(?, title),
          content = COALESCE(?, content),
          status = COALESCE(?, status),
          updated_at = datetime('now')
      WHERE id = ?
    `;

    await db.run(query, [title, content, status, postId]);

    // Get updated post
    const post = await db.get('SELECT id, title, content, status, updated_at FROM creative_posts WHERE id = ?', [postId]);
    return post || null;
  }

  static async deletePost(postId) {
    const query = `DELETE FROM creative_posts WHERE id = ?`;
    const result = await db.run(query, [postId]);
    return result.changes > 0 ? { id: postId } : null;
  }

  static async getPostStats(postId) {
    const postQuery = `SELECT id, likes FROM creative_posts WHERE id = ?`;
    const post = await db.get(postQuery, [postId]);

    if (!post) return null;

    const commentQuery = `SELECT COUNT(*) as comment_count FROM comments WHERE post_id = ?`;
    const commentResult = await db.get(commentQuery, [postId]);

    return {
      id: post.id,
      likes: post.likes,
      comment_count: commentResult.comment_count
    };
  }
}

module.exports = CreativePost;
