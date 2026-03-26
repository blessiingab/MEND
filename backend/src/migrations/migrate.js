/**
 * Database Migration - Create all tables
 */
const pool = require('../config/database');

const createTables = async () => {
  try {
    console.log('Creating database tables...');

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        bio TEXT,
        profile_image VARCHAR(500),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Assessments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        answers JSONB,
        total_score INTEGER,
        severity VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Assessments table created');

    // Therapy Sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS therapy_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        therapist_id INTEGER NOT NULL REFERENCES users(id),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Therapy Sessions table created');

    // Creative Posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS creative_posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        thumbnail VARCHAR(500),
        status VARCHAR(50) DEFAULT 'published',
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Creative Posts table created');

    // Post Likes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES creative_posts(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id)
      )
    `);
    console.log('✓ Post Likes table created');

    // Comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES creative_posts(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Comments table created');

    // Career Guidance table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS career_guidance (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        career_goal VARCHAR(500),
        current_role VARCHAR(500),
        experience TEXT,
        guidance TEXT,
        recommended_actions JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Career Guidance table created');

    // Career Resources table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS career_resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        type VARCHAR(100),
        link VARCHAR(1000) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Career Resources table created');

    // Career Progress table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS career_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        goal VARCHAR(500),
        milestone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Career Progress table created');

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON therapy_sessions(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_sessions_therapist_id ON therapy_sessions(therapist_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_user_id ON creative_posts(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_career_user_id ON career_guidance(user_id)`);
    console.log('✓ Indexes created');

    console.log('✅ All tables created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    process.exit(1);
  }
};

createTables();
