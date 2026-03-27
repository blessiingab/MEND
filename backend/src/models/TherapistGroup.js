const db = require('../config/database');

class TherapistGroup {
  static async ensureTables() {
    await db.run(`
      CREATE TABLE IF NOT EXISTS therapist_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        therapist_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        care_focus TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (therapist_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS therapist_group_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES therapist_groups(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(group_id, user_id)
      )
    `);

    await db.run(`CREATE INDEX IF NOT EXISTS idx_tg_therapist_id ON therapist_groups(therapist_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_tgm_group_id ON therapist_group_members(group_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_tgm_user_id ON therapist_group_members(user_id)`);
  }

  static async createGroup(therapistId, { name, description, careFocus }) {
    await this.ensureTables();

    const result = await db.run(
      `
      INSERT INTO therapist_groups (therapist_id, name, description, care_focus, created_at, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `,
      [therapistId, name, description || null, careFocus || null]
    );

    return db.get(
      `SELECT id, therapist_id, name, description, care_focus, created_at FROM therapist_groups WHERE id = ?`,
      [result.id]
    );
  }

  static async getGroupById(groupId) {
    await this.ensureTables();
    return db.get(`SELECT * FROM therapist_groups WHERE id = ?`, [groupId]);
  }

  static async getTherapistGroups(therapistId) {
    await this.ensureTables();

    const groups = await db.all(
      `
      SELECT id, therapist_id, name, description, care_focus, created_at, updated_at
      FROM therapist_groups
      WHERE therapist_id = ?
      ORDER BY created_at DESC
      `,
      [therapistId]
    );

    for (const group of groups) {
      const members = await db.all(
        `
        SELECT
          u.id, u.first_name, u.last_name, u.email,
          tgm.created_at as added_at
        FROM therapist_group_members tgm
        JOIN users u ON u.id = tgm.user_id
        WHERE tgm.group_id = ?
        ORDER BY u.first_name, u.last_name
        `,
        [group.id]
      );
      group.members = members;
    }

    return groups;
  }

  static async addMember(groupId, userId) {
    await this.ensureTables();

    await db.run(
      `
      INSERT OR IGNORE INTO therapist_group_members (group_id, user_id, created_at)
      VALUES (?, ?, datetime('now'))
      `,
      [groupId, userId]
    );

    return db.get(
      `
      SELECT id, group_id, user_id, created_at
      FROM therapist_group_members
      WHERE group_id = ? AND user_id = ?
      `,
      [groupId, userId]
    );
  }

  static async removeMember(groupId, userId) {
    await this.ensureTables();
    const result = await db.run(
      `DELETE FROM therapist_group_members WHERE group_id = ? AND user_id = ?`,
      [groupId, userId]
    );
    return result.changes > 0;
  }

  static async getAvailableClientsForTherapist(therapistId) {
    await this.ensureTables();
    return db.all(
      `
      SELECT DISTINCT u.id, u.first_name, u.last_name, u.email
      FROM therapy_sessions ts
      JOIN users u ON u.id = ts.user_id
      WHERE ts.therapist_id = ?
      ORDER BY u.first_name, u.last_name
      `,
      [therapistId]
    );
  }
}

module.exports = TherapistGroup;
