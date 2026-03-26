/**
 * Assessment Model - PHQ-9 and GAD-7 assessments
 */
const pool = require('../config/database');
const { PHQ9_SCORES, GAD7_SCORES } = require('../config/constants');

class Assessment {
  static async createAssessment(assessmentData) {
    const { userId, type, answers, totalScore, severity } = assessmentData;
    
    const query = `
      INSERT INTO assessments (user_id, type, answers, total_score, severity, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, user_id, type, total_score, severity, created_at
    `;
    
    const result = await pool.query(query, [userId, type, JSON.stringify(answers), totalScore, severity]);
    return result.rows[0];
  }

  static async getUserAssessments(userId, limit = 20, offset = 0) {
    const query = `
      SELECT id, user_id, type, total_score, severity, created_at
      FROM assessments
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  static async getLatestAssessment(userId, type) {
    const query = `
      SELECT * FROM assessments
      WHERE user_id = $1 AND type = $2
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await pool.query(query, [userId, type]);
    return result.rows[0] || null;
  }

  static calculatePHQ9Severity(score) {
    if (score >= PHQ9_SCORES.SEVERE.min && score <= PHQ9_SCORES.SEVERE.max) return 'severe';
    if (score >= PHQ9_SCORES.MODERATELY_SEVERE.min && score <= PHQ9_SCORES.MODERATELY_SEVERE.max) return 'moderately_severe';
    if (score >= PHQ9_SCORES.MODERATE.min && score <= PHQ9_SCORES.MODERATE.max) return 'moderate';
    if (score >= PHQ9_SCORES.MILD.min && score <= PHQ9_SCORES.MILD.max) return 'mild';
    return 'minimal';
  }

  static calculateGAD7Severity(score) {
    if (score >= GAD7_SCORES.SEVERE.min && score <= GAD7_SCORES.SEVERE.max) return 'severe';
    if (score >= GAD7_SCORES.MODERATE.min && score <= GAD7_SCORES.MODERATE.max) return 'moderate';
    if (score >= GAD7_SCORES.MILD.min && score <= GAD7_SCORES.MILD.max) return 'mild';
    return 'minimal';
  }

  static async getAssessmentById(assessmentId) {
    const query = `SELECT * FROM assessments WHERE id = $1`;
    const result = await pool.query(query, [assessmentId]);
    return result.rows[0] || null;
  }

  static async getUserAssessmentStats(userId) {
    const query = `
      SELECT 
        type,
        COUNT(*) as total_assessments,
        AVG(total_score) as avg_score,
        MAX(total_score) as highest_score,
        MIN(total_score) as lowest_score
      FROM assessments
      WHERE user_id = $1
      GROUP BY type
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Assessment;
