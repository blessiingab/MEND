// Assessment Constants
const ASSESSMENTS = {
  PHQ9: 'phq9',
  GAD7: 'gad7'
};

// PHQ-9 Scoring (Depression)
const PHQ9_SCORES = {
  MINIMAL: { min: 0, max: 4 },
  MILD: { min: 5, max: 9 },
  MODERATE: { min: 10, max: 14 },
  MODERATELY_SEVERE: { min: 15, max: 19 },
  SEVERE: { min: 20, max: 27 }
};

// GAD-7 Scoring (Anxiety)
const GAD7_SCORES = {
  MINIMAL: { min: 0, max: 4 },
  MILD: { min: 5, max: 9 },
  MODERATE: { min: 10, max: 14 },
  SEVERE: { min: 15, max: 21 }
};

// User Roles
const USER_ROLES = {
  USER: 'user',
  THERAPIST: 'therapist',
  ADMIN: 'admin'
};

// Session Status
const SESSION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Post Types
const POST_TYPES = {
  STORY: 'story',
  ART: 'art'
};

// Creative Content Status
const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

module.exports = {
  ASSESSMENTS,
  PHQ9_SCORES,
  GAD7_SCORES,
  USER_ROLES,
  SESSION_STATUS,
  POST_TYPES,
  CONTENT_STATUS
};
