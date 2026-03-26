/**
 * Role Middleware - Role-based access control
 */
const { errorResponse } = require('../utils/responseHandler');

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied - insufficient permissions', 403);
    }

    next();
  };
};

module.exports = roleMiddleware;
