/**
 * Database Seed - Populate with sample data
 */
const pool = require('../config/database');
const User = require('../models/User');
const CreativePost = require('../models/CreativePost');

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Create sample users
    const therapistUser = await User.create({
      email: 'therapist@mend.com',
      password: 'TherapistPass123',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      role: 'therapist'
    });
    console.log('✓ Therapist user created');

    const regularUser = await User.create({
      email: 'user@mend.com',
      password: 'UserPass123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user'
    });
    console.log('✓ Regular user created');

    // Create sample posts
    await CreativePost.create({
      userId: regularUser.id,
      title: 'My Journey to Wellness',
      content: 'This is my personal story about overcoming anxiety and finding peace. It has been a long but rewarding journey.',
      type: 'story',
      thumbnail: 'https://via.placeholder.com/400x300'
    });
    console.log('✓ Sample story post created');

    await CreativePost.create({
      userId: regularUser.id,
      title: 'Abstract Art Therapy',
      content: 'Art has been my form of expression and healing. This piece represents my inner peace.',
      type: 'art',
      thumbnail: 'https://via.placeholder.com/400x300'
    });
    console.log('✓ Sample art post created');

    // Create career resources
    await pool.query(`
      INSERT INTO career_resources (title, description, type, link, is_active)
      VALUES 
        ('LinkedIn Learning', 'Online courses for career development', 'course', 'https://linkedin.com/learning', true),
        ('Udemy Courses', 'Affordable online education', 'course', 'https://udemy.com', true),
        ('Indeed Resume Guide', 'Guide to writing effective resumes', 'guide', 'https://indeed.com', true),
        ('Glassdoor Salary Data', 'Salary and company reviews', 'research', 'https://glassdoor.com', true)
    `);
    console.log('✓ Career resources created');

    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
