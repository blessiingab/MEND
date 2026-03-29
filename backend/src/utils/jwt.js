const jwt = require('jsonwebtoken');
const logger = require('./logger');

const DEFAULT_DEV_JWT_SECRET = 'mend-dev-jwt-secret-change-before-production';

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production');
  }

  logger.warn('JWT_SECRET is not set. Falling back to the local development secret.');
  return DEFAULT_DEV_JWT_SECRET;
};

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
