const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const dotenv = require('dotenv');

dotenv.config();

const configuredDbPath = process.env.DB_PATH || process.env.DB_NAME || 'mend.db';
const dbPath = path.isAbsolute(configuredDbPath)
  ? configuredDbPath
  : path.resolve(__dirname, '../../', configuredDbPath);

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// Create database connection
let db;

try {
  db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON');
  console.log('Connected to SQLite database');
} catch (err) {
  console.error('Error opening database:', err.message);
  throw err;
}

// Promisify database operations for easier async/await usage
const dbAsync = {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        const statement = db.prepare(sql);
        const result = statement.run(...params);

        resolve({
          id: Number(result.lastInsertRowid),
          changes: result.changes
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        const statement = db.prepare(sql);
        resolve(statement.get(...params));
      } catch (err) {
        reject(err);
      }
    });
  },

  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        const statement = db.prepare(sql);
        resolve(statement.all(...params));
      } catch (err) {
        reject(err);
      }
    });
  },

  close: () => {
    return new Promise((resolve, reject) => {
      try {
        db.close();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
};

module.exports = dbAsync;
