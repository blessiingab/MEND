/**
 * User Model - Handles user-related database operations
 */
const db = require('../config/database');
const bcrypt = require('bcrypt');

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (
        email, password, first_name, last_name, role, bio, profile_image,
        license_number, specialization, expertise_area, experience_years,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
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
      experienceYears
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
    return await bcrypt.compare(plainPassword, hashedPassword);
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
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = `
      UPDATE users
      SET password = ?, updated_at = datetime('now')
      WHERE id = ?
    `;

    await db.run(query, [hashedPassword, userId]);

    // Get updated user
    const user = await db.get('SELECT id, email FROM users WHERE id = ?', [userId]);
    return user || null;
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
