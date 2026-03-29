/**
 * Auth Controller - Handle authentication requests
 */
const AuthService = require('../services/AuthService');
const { USER_ROLES } = require('../config/constants');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const PUBLIC_REGISTRATION_ROLES = new Set([
  USER_ROLES.USER,
  USER_ROLES.THERAPIST,
  USER_ROLES.MENTOR
]);

class AuthController {
  static async register(req, res) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role = 'user',
        bio,
        profileImage,
        licenseNumber,
        specialization,
        expertiseArea,
        experienceYears
      } = req.body;

      if (!email || !password) {
        return errorResponse(res, 'Email and password are required', 400);
      }

      if (!PUBLIC_REGISTRATION_ROLES.has(role)) {
        return errorResponse(
          res,
          'Invalid role selected. Public registration supports user, therapist, or mentor accounts.',
          400
        );
      }

      const result = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
        role,
        bio,
        profileImage,
        licenseNumber,
        specialization,
        expertiseArea,
        experienceYears
      });

      return successResponse(res, 'User registered successfully', result, 201);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return errorResponse(res, 'Email and password are required', 400);
      }

      const result = await AuthService.login(email, password);

      return successResponse(res, 'Login successful', result);
    } catch (error) {
      return errorResponse(res, error.message, 401, error);
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return errorResponse(res, 'Old and new password are required', 400);
      }

      await AuthService.changePassword(req.user.id, oldPassword, newPassword);

      return successResponse(res, 'Password changed successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email, appUrl } = req.body;

      if (!email) {
        return errorResponse(res, 'Email is required', 400);
      }

      const result = await AuthService.requestPasswordReset(email, appUrl);

      return successResponse(
        res,
        'If an account with that email exists, password reset instructions have been prepared.',
        result
      );
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return errorResponse(res, 'Reset token and new password are required', 400);
      }

      const result = await AuthService.resetPassword(token, newPassword);

      return successResponse(res, 'Password reset successfully', result);
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async getProfile(req, res) {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.user.id);

      return successResponse(res, 'Profile retrieved', {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        bio: user.bio,
        profileImage: user.profile_image,
        createdAt: user.created_at
      });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }

  static async updateProfile(req, res) {
    try {
      const { firstName, lastName, bio, profileImage } = req.body;
      const User = require('../models/User');

      const user = await User.updateProfile(req.user.id, {
        firstName,
        lastName,
        bio,
        profileImage
      });

      return successResponse(res, 'Profile updated successfully', {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        bio: user.bio,
        profileImage: user.profile_image
      });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }
}

module.exports = AuthController;
