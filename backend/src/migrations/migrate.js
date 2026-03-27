/**
 * Database Migration - Create all tables
 */
const db = require('../config/database');

const createTables = async () => {
  try {
    console.log('Creating database tables...');

    // Users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        bio TEXT,
        profile_image TEXT,
        role TEXT DEFAULT 'user',
        license_number TEXT,
        specialization TEXT,
        expertise_area TEXT,
        experience_years INTEGER,
        password_reset_token TEXT,
        password_reset_expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure legacy databases gain the new columns if they are missing
    const userColumns = await db.all(`PRAGMA table_info(users)`);
    const hasColumn = (name) => userColumns.some((col) => col.name === name);

    if (!hasColumn('license_number')) {
      await db.run(`ALTER TABLE users ADD COLUMN license_number TEXT`);
      console.log('Added license_number column to users table');
    }
    if (!hasColumn('specialization')) {
      await db.run(`ALTER TABLE users ADD COLUMN specialization TEXT`);
      console.log('Added specialization column to users table');
    }
    if (!hasColumn('expertise_area')) {
      await db.run(`ALTER TABLE users ADD COLUMN expertise_area TEXT`);
      console.log('Added expertise_area column to users table');
    }
    if (!hasColumn('experience_years')) {
      await db.run(`ALTER TABLE users ADD COLUMN experience_years INTEGER`);
      console.log('Added experience_years column to users table');
    }
    if (!hasColumn('password_reset_token')) {
      await db.run(`ALTER TABLE users ADD COLUMN password_reset_token TEXT`);
      console.log('Added password_reset_token column to users table');
    }
    if (!hasColumn('password_reset_expires_at')) {
      await db.run(`ALTER TABLE users ADD COLUMN password_reset_expires_at DATETIME`);
      console.log('Added password_reset_expires_at column to users table');
    }

    console.log('Users table created');

    // Assessments table
    await db.run(`
      CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        answers TEXT,
        total_score INTEGER,
        severity TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Assessments table created');

    // Therapy Sessions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS therapy_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        therapist_id INTEGER NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (therapist_id) REFERENCES users(id)
      )
    `);
    console.log('Therapy Sessions table created');

    // Creative Posts table
    await db.run(`
      CREATE TABLE IF NOT EXISTS creative_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        thumbnail TEXT,
        status TEXT DEFAULT 'published',
        likes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Creative Posts table created');

    // Post Likes table
    await db.run(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES creative_posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(post_id, user_id)
      )
    `);
    console.log('Post Likes table created');

    // Comments table
    await db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES creative_posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Comments table created');

    // Career Guidance table
    await db.run(`
      CREATE TABLE IF NOT EXISTS career_guidance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        career_goal TEXT,
        current_role TEXT,
        experience TEXT,
        guidance TEXT,
        recommended_actions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Career Guidance table created');

    // Career Resources table
    await db.run(`
      CREATE TABLE IF NOT EXISTS career_resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT,
        link TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Career Resources table created');

    // Career Progress table
    await db.run(`
      CREATE TABLE IF NOT EXISTS career_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        goal TEXT,
        milestone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Career Progress table created');

    // Create indexes
    await db.run(`CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON therapy_sessions(user_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_therapist_id ON therapy_sessions(therapist_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_posts_user_id ON creative_posts(user_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_career_user_id ON career_guidance(user_id)`);
    await db.run(`CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token)`);
    console.log('Indexes created');

    console.log('All tables created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error.message);
    process.exit(1);
  }
};

createTables();
