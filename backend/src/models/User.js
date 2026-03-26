/**
 * User Model - Handles user-related database operations
 */
const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    const { email, password, firstName, lastName, role = 'user' } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (email, password, first_name, last_name, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, email, first_name, last_name, role, created_at
    `;
    
    const result = await pool.query(query, [email, hashedPassword, firstName, lastName, role]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateProfile(userId, updates) {
    const { firstName, lastName, bio, profileImage } = updates;
    
    const query = `
      UPDATE users 
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          bio = COALESCE($3, bio),
          profile_image = COALESCE($4, profile_image),
          updated_at = NOW()
      WHERE id = $5
      RETURNING id, email, first_name, last_name, bio, profile_image, role
    `;
    
    const result = await pool.query(query, [firstName, lastName, bio, profileImage, userId]);
    return result.rows[0] || null;
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const query = `
      UPDATE users 
      SET password = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email
    `;
    
    const result = await pool.query(query, [hashedPassword, userId]);
    return result.rows[0] || null;
  }

  static async getAllUsers(limit = 50, offset = 0) {
    const query = `
      SELECT id, email, first_name, last_name, role, created_at 
      FROM users 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async countUsers() {
    const result = await pool.query(`SELECT COUNT(*) as count FROM users`);
    return parseInt(result.rows[0].count);
  }

  static async deleteUser(userId) {
    const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }
}

module.exports = User;
