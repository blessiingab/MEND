/**
 * Auth Middleware - JWT verification and user authentication
 */
const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/responseHandler');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'No authentication token provided', 401);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401, error.message);
  }
};

module.exports = authMiddleware;
