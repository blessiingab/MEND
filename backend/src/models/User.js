/**
 * User Model - Handles user-related database operations
 */
const db = require('../config/database');
const passwordUtils = require('../utils/password');

class User {
  static async create(userData) {
    const {
      email,
      password,
      firstName,
      lastName,
      role = 'user',
      bio = null,
      profileImage = null,
      licenseNumber = null,
      specialization = null,
      expertiseArea = null,
      experienceYears = null
    } = userData;

    const hashedPassword = await passwordUtils.hashPassword(password);

    const query = `
      INSERT INTO users (
        email, password, first_name, last_name, role, bio, profile_image,
        license_number, specialization, expertise_area, experience_years,
        password_reset_token, password_reset_expires_at,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    const result = await db.run(query, [
      email,
      hashedPassword,
      firstName,
      lastName,
      role,
      bio,
      profileImage,
      licenseNumber,
      specialization,
      expertiseArea,
      experienceYears,
      null,
      null
    ]);

    // Get the created user
    const user = await db.get(`
      SELECT id, email, first_name, last_name, role, bio, profile_image,
        license_number, specialization, expertise_area, experience_years, created_at
      FROM users WHERE id = ?
    `, [result.id]);
    return user;
  }

  static async findById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const result = await db.get(query, [id]);
    return result || null;
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const result = await db.get(query, [email]);
    return result || null;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await passwordUtils.verifyPassword(plainPassword, hashedPassword);
  }

  static async updateProfile(userId, updates) {
    const { firstName, lastName, bio, profileImage } = updates;

    const query = `
      UPDATE users
      SET first_name = COALESCE(?, first_name),
          last_name = COALESCE(?, last_name),
          bio = COALESCE(?, bio),
          profile_image = COALESCE(?, profile_image),
          updated_at = datetime('now')
      WHERE id = ?
    `;

    await db.run(query, [firstName, lastName, bio, profileImage, userId]);

    // Get updated user
    const user = await db.get('SELECT id, email, first_name, last_name, bio, profile_image, role FROM users WHERE id = ?', [userId]);
    return user || null;
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await passwordUtils.hashPassword(newPassword);

    const query = `
      UPDATE users
      SET password = ?,
          password_reset_token = NULL,
          password_reset_expires_at = NULL,
          updated_at = datetime('now')
      WHERE id = ?
    `;

    await db.run(query, [hashedPassword, userId]);

    // Get updated user
    const user = await db.get('SELECT id, email FROM users WHERE id = ?', [userId]);
    return user || null;
  }

  static async savePasswordResetToken(userId, tokenHash, expiresAt) {
    const query = `
      UPDATE users
      SET password_reset_token = ?,
          password_reset_expires_at = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `;

    await db.run(query, [tokenHash, expiresAt, userId]);
    return true;
  }

  static async findByPasswordResetToken(tokenHash) {
    const query = `
      SELECT *
      FROM users
      WHERE password_reset_token = ?
        AND password_reset_expires_at IS NOT NULL
        AND datetime(password_reset_expires_at) > datetime('now')
      LIMIT 1
    `;

    const result = await db.get(query, [tokenHash]);
    return result || null;
  }

  static async clearPasswordResetToken(userId) {
    const query = `
      UPDATE users
      SET password_reset_token = NULL,
          password_reset_expires_at = NULL,
          updated_at = datetime('now')
      WHERE id = ?
    `;

    await db.run(query, [userId]);
    return true;
  }

  static async getAllUsers(limit = 50, offset = 0) {
    const query = `
      SELECT id, email, first_name, last_name, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await db.all(query, [limit, offset]);
    return result;
  }

  static async countUsers() {
    const result = await db.get(`SELECT COUNT(*) as count FROM users`);
    return parseInt(result.count);
  }

  static async deleteUser(userId) {
    const query = `DELETE FROM users WHERE id = ?`;
    const result = await db.run(query, [userId]);
    return result.changes > 0 ? { id: userId } : null;
  }
}

module.exports = User;
