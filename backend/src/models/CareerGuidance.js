/**
 * CareerGuidance Model - Career counseling resources and tracks
 */
const pool = require('../config/database');

class CareerGuidance {
  static async createGuidanceSession(sessionData) {
    const { userId, careerGoal, currentRole, experience, guidance, recommendedActions } = sessionData;
    
    const query = `
      INSERT INTO career_guidance (user_id, career_goal, current_role, experience, guidance, recommended_actions, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, user_id, career_goal, guidance, created_at
    `;
    
    const result = await pool.query(query, [userId, careerGoal, currentRole, experience, guidance, JSON.stringify(recommendedActions)]);
    return result.rows[0];
  }

  static async getUserCareerPath(userId) {
    const query = `
      SELECT id, user_id, career_goal, current_role, experience, guidance, recommended_actions, created_at
      FROM career_guidance
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  static async getUserCareerHistory(userId, limit = 10, offset = 0) {
    const query = `
      SELECT id, user_id, career_goal, current_role, experience, guidance, created_at
      FROM career_guidance
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  static async createResource(resourceData) {
    const { title, description, type, link, isActive = true } = resourceData;
    
    const query = `
      INSERT INTO career_resources (title, description, type, link, is_active, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, title, description, type, link
    `;
    
    const result = await pool.query(query, [title, description, type, link, isActive]);
    return result.rows[0];
  }

  static async getActiveResources(type = null, limit = 50, offset = 0) {
    let query = `
      SELECT id, title, description, type, link, created_at
      FROM career_resources
      WHERE is_active = true
    `;
    
    const params = [];
    
    if (type) {
      query += ` AND type = $1`;
      params.push(type);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getResourceById(resourceId) {
    const query = `SELECT * FROM career_resources WHERE id = $1`;
    const result = await pool.query(query, [resourceId]);
    return result.rows[0] || null;
  }

  static async updateResource(resourceId, updates) {
    const { title, description, link, isActive } = updates;
    
    const query = `
      UPDATE career_resources
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          link = COALESCE($3, link),
          is_active = COALESCE($4, is_active),
          updated_at = NOW()
      WHERE id = $5
      RETURNING id, title, description, link, is_active
    `;
    
    const result = await pool.query(query, [title, description, link, isActive, resourceId]);
    return result.rows[0] || null;
  }

  static async deleteResource(resourceId) {
    const query = `DELETE FROM career_resources WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [resourceId]);
    return result.rows[0] || null;
  }

  static async trackCareerProgress(userId, goal, milestone) {
    const query = `
      INSERT INTO career_progress (user_id, goal, milestone, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, user_id, goal, milestone, created_at
    `;
    
    const result = await pool.query(query, [userId, goal, milestone]);
    return result.rows[0];
  }

  static async getUserProgressTracking(userId) {
    const query = `
      SELECT id, user_id, goal, milestone, created_at
      FROM career_progress
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = CareerGuidance;
