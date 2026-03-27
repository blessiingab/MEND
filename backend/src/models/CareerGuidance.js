/**
 * CareerGuidance Model - Career counseling resources and tracks
 */
const db = require('../config/database');

class CareerGuidance {
  static async createGuidanceSession(sessionData) {
    const { userId, careerGoal, currentRole, experience, guidance, recommendedActions } = sessionData;

    const query = `
      INSERT INTO career_guidance (user_id, career_goal, current_role, experience, guidance, recommended_actions, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    const result = await db.run(query, [userId, careerGoal, currentRole, experience, guidance, JSON.stringify(recommendedActions)]);

    // Get the created guidance session
    const guidanceSession = await db.get('SELECT id, user_id, career_goal, guidance, created_at FROM career_guidance WHERE id = ?', [result.id]);
    return guidanceSession;
  }

  static async getUserCareerPath(userId) {
    const query = `
      SELECT id, user_id, career_goal, current_role, experience, guidance, recommended_actions, created_at
      FROM career_guidance
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const result = await db.get(query, [userId]);
    if (!result) return null;

    try {
      result.recommended_actions = result.recommended_actions
        ? JSON.parse(result.recommended_actions)
        : [];
    } catch (parseErr) {
      result.recommended_actions = result.recommended_actions || [];
    }

    return result;
  }

  static async getUserCareerHistory(userId, limit = 10, offset = 0) {
    const query = `
      SELECT id, user_id, career_goal, current_role, experience, guidance, created_at
      FROM career_guidance
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await db.all(query, [userId, limit, offset]);
    return result.map((item) => {
      try {
        item.recommended_actions = item.recommended_actions
          ? JSON.parse(item.recommended_actions)
          : [];
      } catch (parseErr) {
        item.recommended_actions = item.recommended_actions || [];
      }
      return item;
    });
  }

  static async createResource(resourceData) {
    const { title, description, type, link, isActive = true } = resourceData;

    const query = `
      INSERT INTO career_resources (title, description, type, link, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    const result = await db.run(query, [title, description, type, link, isActive]);

    // Get the created resource
    const resource = await db.get('SELECT id, title, description, type, link FROM career_resources WHERE id = ?', [result.id]);
    return resource;
  }

  static async getActiveResources(type = null, limit = 50, offset = 0) {
    let query = `
      SELECT id, title, description, type, link, created_at
      FROM career_resources
      WHERE is_active = 1
    `;

    const params = [];

    if (type) {
      query += ` AND type = ?`;
      params.push(type);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const result = await db.all(query, params);
    return result;
  }

  static async getResourceById(resourceId) {
    const query = `SELECT * FROM career_resources WHERE id = ?`;
    const result = await db.get(query, [resourceId]);
    return result || null;
  }

  static async updateResource(resourceId, updates) {
    const { title, description, link, isActive } = updates;

    const query = `
      UPDATE career_resources
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          link = COALESCE(?, link),
          is_active = COALESCE(?, is_active),
          updated_at = datetime('now')
      WHERE id = ?
    `;

    await db.run(query, [title, description, link, isActive, resourceId]);

    // Get updated resource
    const resource = await db.get('SELECT id, title, description, link, is_active FROM career_resources WHERE id = ?', [resourceId]);
    return resource || null;
  }

  static async deleteResource(resourceId) {
    const query = `DELETE FROM career_resources WHERE id = ?`;
    const result = await db.run(query, [resourceId]);
    return result.changes > 0 ? { id: resourceId } : null;
  }

  static async trackCareerProgress(userId, goal, milestone) {
    const query = `
      INSERT INTO career_progress (user_id, goal, milestone, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `;

    const result = await db.run(query, [userId, goal, milestone]);

    // Get the created progress entry
    const progress = await db.get('SELECT id, user_id, goal, milestone, created_at FROM career_progress WHERE id = ?', [result.id]);
    return progress;
  }

  static async getUserProgressTracking(userId) {
    const query = `
      SELECT id, user_id, goal, milestone, created_at
      FROM career_progress
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    const result = await db.all(query, [userId]);
    return result;
  }
}

module.exports = CareerGuidance;
