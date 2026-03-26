/**
 * TherapySession Model - Booking and managing therapy sessions
 */
const pool = require('../config/database');

class TherapySession {
  static async create(sessionData) {
    const { userId, therapistId, startTime, endTime, notes, status = 'pending' } = sessionData;
    
    const query = `
      INSERT INTO therapy_sessions (user_id, therapist_id, start_time, end_time, notes, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, user_id, therapist_id, start_time, end_time, status, created_at
    `;
    
    const result = await pool.query(query, [userId, therapistId, startTime, endTime, notes, status]);
    return result.rows[0];
  }

  static async getUserSessions(userId, limit = 20, offset = 0) {
    const query = `
      SELECT 
        ts.id, ts.user_id, ts.therapist_id, ts.start_time, ts.end_time, 
        ts.notes, ts.status, ts.created_at,
        u.first_name, u.last_name, u.email
      FROM therapy_sessions ts
      JOIN users u ON u.id = ts.therapist_id
      WHERE ts.user_id = $1
      ORDER BY ts.start_time DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  static async getTherapistSessions(therapistId, limit = 20, offset = 0) {
    const query = `
      SELECT 
        ts.id, ts.user_id, ts.therapist_id, ts.start_time, ts.end_time, 
        ts.notes, ts.status, ts.created_at,
        u.first_name, u.last_name, u.email
      FROM therapy_sessions ts
      JOIN users u ON u.id = ts.user_id
      WHERE ts.therapist_id = $1
      ORDER BY ts.start_time DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [therapistId, limit, offset]);
    return result.rows;
  }

  static async getSessionById(sessionId) {
    const query = `SELECT * FROM therapy_sessions WHERE id = $1`;
    const result = await pool.query(query, [sessionId]);
    return result.rows[0] || null;
  }

  static async updateSession(sessionId, updates) {
    const { notes, status, endTime } = updates;
    
    const query = `
      UPDATE therapy_sessions
      SET notes = COALESCE($1, notes),
          status = COALESCE($2, status),
          end_time = COALESCE($3, end_time),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, user_id, therapist_id, start_time, end_time, status, notes
    `;
    
    const result = await pool.query(query, [notes, status, endTime, sessionId]);
    return result.rows[0] || null;
  }

  static async cancelSession(sessionId) {
    const query = `
      UPDATE therapy_sessions
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1
      RETURNING id, status
    `;
    
    const result = await pool.query(query, [sessionId]);
    return result.rows[0] || null;
  }

  static async getAvailableTherapists() {
    const query = `
      SELECT id, first_name, last_name, email
      FROM users
      WHERE role = 'therapist'
      ORDER BY first_name, last_name
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async checkTherapistAvailability(therapistId, startTime, endTime) {
    const query = `
      SELECT COUNT(*) as conflictCount
      FROM therapy_sessions
      WHERE therapist_id = $1
      AND status != 'cancelled'
      AND (
        (start_time < $3 AND end_time > $2)
      )
    `;
    
    const result = await pool.query(query, [therapistId, startTime, endTime]);
    return result.rows[0].conflictcount === 0;
  }

  static async getSessionStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
        COUNT(CASE WHEN status = 'upcoming' THEN 1 END) as upcoming_sessions
      FROM therapy_sessions
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = TherapySession;
