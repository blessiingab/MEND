/**
 * Database Seed - Populate with sample data
 */
const db = require('../config/database');
const User = require('../models/User');
const CreativePost = require('../models/CreativePost');

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Create sample users (check if they exist first)
    let therapistUser = await User.findByEmail('therapist@mend.com');
    if (!therapistUser) {
      therapistUser = await User.create({
        email: 'therapist@mend.com',
        password: 'TherapistPass123',
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        role: 'therapist'
      });
      console.log('✓ Therapist user created');
    } else {
      console.log('✓ Therapist user already exists');
    }

    let regularUser = await User.findByEmail('user@mend.com');
    if (!regularUser) {
      regularUser = await User.create({
        email: 'user@mend.com',
        password: 'UserPass123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      });
      console.log('✓ Regular user created');
    } else {
      console.log('✓ Regular user already exists');
    }

    let mentorUser = await User.findByEmail('mentor@mend.com');
    if (!mentorUser) {
      mentorUser = await User.create({
        email: 'mentor@mend.com',
        password: 'MentorPass123',
        firstName: 'Alex',
        lastName: 'Chen',
        role: 'mentor'
      });
      console.log('✓ Mentor user created');
    } else {
      console.log('✓ Mentor user already exists');
    }

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
    await db.run(`
      INSERT INTO career_resources (title, description, type, link, is_active, created_at, updated_at)
      VALUES
        ('LinkedIn Learning', 'Online courses for career development', 'course', 'https://linkedin.com/learning', 1, datetime('now'), datetime('now')),
        ('Udemy Courses', 'Affordable online education', 'course', 'https://udemy.com', 1, datetime('now'), datetime('now')),
        ('Indeed Resume Guide', 'Guide to writing effective resumes', 'guide', 'https://indeed.com', 1, datetime('now'), datetime('now')),
        ('Glassdoor Salary Data', 'Salary and company reviews', 'research', 'https://glassdoor.com', 1, datetime('now'), datetime('now'))
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
