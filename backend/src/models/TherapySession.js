/**
 * TherapySession Model - Booking and managing therapy sessions
 */
const db = require('../config/database');

class TherapySession {
  static async create(sessionData) {
    const { userId, therapistId, startTime, endTime, notes, status = 'pending' } = sessionData;

    const query = `
      INSERT INTO therapy_sessions (user_id, therapist_id, start_time, end_time, notes, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    const result = await db.run(query, [userId, therapistId, startTime, endTime, notes, status]);

    // Get the created session
    const session = await db.get(`
      SELECT
        ts.id, ts.user_id, ts.therapist_id, ts.start_time, ts.end_time,
        ts.notes, ts.status, ts.created_at,
        u.first_name, u.last_name, u.email
      FROM therapy_sessions ts
      JOIN users u ON u.id = ts.therapist_id
      WHERE ts.id = ?
    `, [result.id]);

    return session;
  }

  static async getUserSessions(userId, limit = 20, offset = 0) {
    const query = `
      SELECT
        ts.id, ts.user_id, ts.therapist_id, ts.start_time, ts.end_time,
        ts.notes, ts.status, ts.created_at,
        u.first_name, u.last_name, u.email
      FROM therapy_sessions ts
      JOIN users u ON u.id = ts.therapist_id
      WHERE ts.user_id = ?
      ORDER BY ts.start_time DESC
      LIMIT ? OFFSET ?
    `;

    const result = await db.all(query, [userId, limit, offset]);
    return result;
  }

  static async getTherapistSessions(therapistId, limit = 20, offset = 0) {
    const query = `
      SELECT
        ts.id, ts.user_id, ts.therapist_id, ts.start_time, ts.end_time,
        ts.notes, ts.status, ts.created_at,
        u.first_name, u.last_name, u.email
      FROM therapy_sessions ts
      JOIN users u ON u.id = ts.user_id
      WHERE ts.therapist_id = ?
      ORDER BY ts.start_time DESC
      LIMIT ? OFFSET ?
    `;

    const result = await db.all(query, [therapistId, limit, offset]);
    return result;
  }

  static async getSessionById(sessionId) {
    const query = `SELECT * FROM therapy_sessions WHERE id = ?`;
    const result = await db.get(query, [sessionId]);
    return result || null;
  }

  static async updateSession(sessionId, updates) {
    const { notes, status, endTime } = updates;

    const query = `
      UPDATE therapy_sessions
      SET notes = COALESCE(?, notes),
          status = COALESCE(?, status),
          end_time = COALESCE(?, end_time),
          updated_at = datetime('now')
      WHERE id = ?
    `;

    await db.run(query, [notes, status, endTime, sessionId]);

    // Get updated session
    const session = await db.get('SELECT id, user_id, therapist_id, start_time, end_time, status, notes FROM therapy_sessions WHERE id = ?', [sessionId]);
    return session || null;
  }

  static async cancelSession(sessionId) {
    const query = `
      UPDATE therapy_sessions
      SET status = 'cancelled', updated_at = datetime('now')
      WHERE id = ?
    `;

    await db.run(query, [sessionId]);

    // Get updated session
    const session = await db.get('SELECT id, status FROM therapy_sessions WHERE id = ?', [sessionId]);
    return session || null;
  }

  static async getAvailableTherapists() {
    const query = `
      SELECT id, first_name, last_name, email
      FROM users
      WHERE role = 'therapist'
      ORDER BY first_name, last_name
    `;

    const result = await db.all(query);
    return result;
  }

  static async checkTherapistAvailability(therapistId, startTime, endTime) {
    const query = `
      SELECT COUNT(*) as conflictCount
      FROM therapy_sessions
      WHERE therapist_id = ?
      AND status != 'cancelled'
      AND (
        (start_time < ? AND end_time > ?)
      )
    `;

    const result = await db.get(query, [therapistId, endTime, startTime]);
    return result.conflictCount === 0;
  }

  static async getSessionStats(userId) {
    const query = `
      SELECT
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
        COUNT(CASE WHEN status = 'upcoming' THEN 1 END) as upcoming_sessions
      FROM therapy_sessions
      WHERE user_id = ?
    `;

    const result = await db.get(query, [userId]);
    return result;
  }
}

module.exports = TherapySession;
