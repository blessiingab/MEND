/**
 * CreativePost Model - Stories and Art posts
 */
const pool = require('../config/database');

class CreativePost {
  static async create(postData) {
    const { userId, title, content, type, thumbnail, status = 'published' } = postData;
    
    const query = `
      INSERT INTO creative_posts (user_id, title, content, type, thumbnail, status, likes, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, 0, NOW(), NOW())
      RETURNING id, user_id, title, content, type, status, likes, created_at
    `;
    
    const result = await pool.query(query, [userId, title, content, type, thumbnail, status]);
    return result.rows[0];
  }

  static async getPostById(postId) {
    const query = `
      SELECT 
        cp.id, cp.user_id, cp.title, cp.content, cp.type, cp.thumbnail, 
        cp.status, cp.likes, cp.created_at, cp.updated_at,
        u.first_name, u.last_name, u.email
      FROM creative_posts cp
      JOIN users u ON u.id = cp.user_id
      WHERE cp.id = $1
    `;
    
    const result = await pool.query(query, [postId]);
    return result.rows[0] || null;
  }

  static async getUserPosts(userId, limit = 20, offset = 0) {
    const query = `
      SELECT id, user_id, title, content, type, thumbnail, status, likes, created_at
      FROM creative_posts
      WHERE user_id = $1 AND status = 'published'
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  static async getAllPosts(type = null, limit = 20, offset = 0) {
    let query = `
      SELECT 
        cp.id, cp.user_id, cp.title, cp.content, cp.type, cp.thumbnail, 
        cp.likes, cp.created_at,
        u.first_name, u.last_name
      FROM creative_posts cp
      JOIN users u ON u.id = cp.user_id
      WHERE cp.status = 'published'
    `;
    
    const params = [];
    
    if (type) {
      query += ` AND cp.type = $1`;
      params.push(type);
    }
    
    query += ` ORDER BY cp.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async likePost(postId, userId) {
    const checkQuery = `SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2`;
    const checkResult = await pool.query(checkQuery, [postId, userId]);
    
    if (checkResult.rows.length > 0) {
      return { liked: false, message: 'Already liked' };
    }
    
    const likeQuery = `INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)`;
    await pool.query(likeQuery, [postId, userId]);
    
    const updateQuery = `
      UPDATE creative_posts
      SET likes = likes + 1
      WHERE id = $1
      RETURNING likes
    `;
    
    const updateResult = await pool.query(updateQuery, [postId]);
    return { liked: true, likes: updateResult.rows[0].likes };
  }

  static async unlikePost(postId, userId) {
    const deleteQuery = `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`;
    await pool.query(deleteQuery, [postId, userId]);
    
    const updateQuery = `
      UPDATE creative_posts
      SET likes = likes - 1
      WHERE id = $1
      RETURNING likes
    `;
    
    const updateResult = await pool.query(updateQuery, [postId]);
    return { liked: false, likes: updateResult.rows[0].likes };
  }

  static async updatePost(postId, updates) {
    const { title, content, status } = updates;
    
    const query = `
      UPDATE creative_posts
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          status = COALESCE($3, status),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, title, content, status, updated_at
    `;
    
    const result = await pool.query(query, [title, content, status, postId]);
    return result.rows[0] || null;
  }

  static async deletePost(postId) {
    const query = `DELETE FROM creative_posts WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [postId]);
    return result.rows[0] || null;
  }

  static async getPostStats(postId) {
    const query = `
      SELECT 
        id, likes, 
        (SELECT COUNT(*) FROM comments WHERE post_id = $1) as comment_count
      FROM creative_posts
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [postId]);
    return result.rows[0] || null;
  }
}

module.exports = CreativePost;
