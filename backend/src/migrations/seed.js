/**
 * Database Seed - Populate with sample data
 */
const db = require('../config/database');
const User = require('../models/User');
const CreativePost = require('../models/CreativePost');

const findPostByTitle = async (userId, title) => {
  return db.get(
    `SELECT id FROM creative_posts WHERE user_id = ? AND title = ? LIMIT 1`,
    [userId, title]
  );
};

const createPostIfMissing = async (postData) => {
  const existingPost = await findPostByTitle(postData.userId, postData.title);

  if (existingPost) {
    console.log(`- Post "${postData.title}" already exists`);
    return existingPost;
  }

  await CreativePost.create(postData);
  console.log(`- Post "${postData.title}" created`);
  return true;
};

const createCareerResourceIfMissing = async (resource) => {
  const existingResource = await db.get(
    `SELECT id FROM career_resources WHERE title = ? AND link = ? LIMIT 1`,
    [resource.title, resource.link]
  );

  if (existingResource) {
    console.log(`- Career resource "${resource.title}" already exists`);
    return existingResource;
  }

  await db.run(
    `
      INSERT INTO career_resources (title, description, type, link, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `,
    [resource.title, resource.description, resource.type, resource.link, resource.isActive]
  );

  console.log(`- Career resource "${resource.title}" created`);
  return true;
};

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    let therapistUser = await User.findByEmail('therapist@mend.com');
    if (!therapistUser) {
      therapistUser = await User.create({
        email: 'therapist@mend.com',
        password: 'TherapistPass123',
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        role: 'therapist',
        bio: 'Licensed Clinical Psychologist specializing in anxiety and depression. 8 years of experience helping individuals navigate mental health challenges.',
        specialization: 'Clinical Psychology',
        expertiseArea: 'Anxiety, Depression, CBT',
        experienceYears: 8,
        licenseNumber: 'PSY12345'
      });
      console.log('- Therapist user created');
    } else {
      console.log('- Therapist user already exists');
    }

    const therapists = [
      {
        email: 'dr.michael.brown@mend.com',
        password: 'TherapistPass123',
        firstName: 'Dr. Michael',
        lastName: 'Brown',
        role: 'therapist',
        bio: 'Licensed Marriage and Family Therapist with expertise in relationship counseling and trauma recovery. 12 years of experience.',
        specialization: 'Marriage and Family Therapy',
        expertiseArea: 'Relationships, Trauma, EMDR',
        experienceYears: 12,
        licenseNumber: 'LMFT67890'
      },
      {
        email: 'dr.emily.davis@mend.com',
        password: 'TherapistPass123',
        firstName: 'Dr. Emily',
        lastName: 'Davis',
        role: 'therapist',
        bio: 'Clinical Social Worker specializing in adolescent mental health and family therapy. 6 years of experience working with teens and families.',
        specialization: 'Clinical Social Work',
        expertiseArea: 'Adolescent Mental Health, Family Therapy',
        experienceYears: 6,
        licenseNumber: 'LCSW11223'
      },
      {
        email: 'dr.robert.wilson@mend.com',
        password: 'TherapistPass123',
        firstName: 'Dr. Robert',
        lastName: 'Wilson',
        role: 'therapist',
        bio: 'Psychiatrist with expertise in medication management and integrative mental health treatment. 15 years of experience.',
        specialization: 'Psychiatry',
        expertiseArea: 'Medication Management, Bipolar Disorder, Schizophrenia',
        experienceYears: 15,
        licenseNumber: 'MD44556'
      },
      {
        email: 'dr.lisa.garcia@mend.com',
        password: 'TherapistPass123',
        firstName: 'Dr. Lisa',
        lastName: 'Garcia',
        role: 'therapist',
        bio: 'Licensed Professional Counselor focusing on career counseling and work-life balance. 10 years of experience.',
        specialization: 'Professional Counseling',
        expertiseArea: 'Career Counseling, Work Stress, Burnout',
        experienceYears: 10,
        licenseNumber: 'LPC77889'
      },
      {
        email: 'dr.david.lee@mend.com',
        password: 'TherapistPass123',
        firstName: 'Dr. David',
        lastName: 'Lee',
        role: 'therapist',
        bio: 'Clinical Psychologist specializing in mindfulness-based therapies and stress management. 9 years of experience.',
        specialization: 'Clinical Psychology',
        expertiseArea: 'Mindfulness, Stress Management, Meditation',
        experienceYears: 9,
        licenseNumber: 'PSY33445'
      }
    ];

    for (const therapistData of therapists) {
      const existingTherapist = await User.findByEmail(therapistData.email);
      if (!existingTherapist) {
        await User.create(therapistData);
        console.log(`- Therapist ${therapistData.firstName} ${therapistData.lastName} created`);
      } else {
        console.log(`- Therapist ${therapistData.firstName} ${therapistData.lastName} already exists`);
      }
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
      console.log('- Regular user created');
    } else {
      console.log('- Regular user already exists');
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
      console.log('- Mentor user created');
    } else {
      console.log('- Mentor user already exists');
    }

    let adminUser = await User.findByEmail('admin@mend.com');
    if (!adminUser) {
      adminUser = await User.create({
        email: 'admin@mend.com',
        password: 'AdminPass123',
        firstName: 'MEND',
        lastName: 'Admin',
        role: 'admin',
        bio: 'Platform administrator for moderation, analytics, and operational support.'
      });
      console.log('- Admin user created');
    } else {
      console.log('- Admin user already exists');
    }

    await createPostIfMissing({
      userId: regularUser.id,
      title: 'My Journey to Wellness',
      content: 'This is my personal story about overcoming anxiety and finding peace. It has been a long but rewarding journey.',
      type: 'story',
      thumbnail: 'https://via.placeholder.com/400x300'
    });

    await createPostIfMissing({
      userId: regularUser.id,
      title: 'Abstract Art Therapy',
      content: 'Art has been my form of expression and healing. This piece represents my inner peace.',
      type: 'art',
      thumbnail: 'https://via.placeholder.com/400x300'
    });

    const careerResources = [
      {
        title: 'LinkedIn Learning',
        description: 'Online courses for career development',
        type: 'course',
        link: 'https://linkedin.com/learning',
        isActive: 1
      },
      {
        title: 'Udemy Courses',
        description: 'Affordable online education',
        type: 'course',
        link: 'https://udemy.com',
        isActive: 1
      },
      {
        title: 'Indeed Resume Guide',
        description: 'Guide to writing effective resumes',
        type: 'guide',
        link: 'https://indeed.com',
        isActive: 1
      },
      {
        title: 'Glassdoor Salary Data',
        description: 'Salary and company reviews',
        type: 'research',
        link: 'https://glassdoor.com',
        isActive: 1
      }
    ];

    for (const resource of careerResources) {
      await createCareerResourceIfMissing(resource);
    }

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
