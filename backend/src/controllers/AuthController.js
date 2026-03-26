/**
 * Auth Controller - Handle authentication requests
 */
const AuthService = require('../services/AuthService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return errorResponse(res, 'Email and password are required', 400);
      }

      const result = await AuthService.register(email, password, firstName, lastName);

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
      const { firstName, lastName, bio, phone } = req.body;
      const User = require('../models/User');

      const updateData = {};
      if (firstName) updateData.first_name = firstName;
      if (lastName) updateData.last_name = lastName;
      if (bio !== undefined) updateData.bio = bio;
      if (phone !== undefined) updateData.phone = phone;

      const user = await User.findById(req.user.id);
      await user.update(updateData);

      return successResponse(res, 'Profile updated successfully', {
        id: user.id,
        email: user.email,
        firstName: updateData.first_name || user.first_name,
        lastName: updateData.last_name || user.last_name,
        role: user.role,
        bio: updateData.bio !== undefined ? updateData.bio : user.bio,
        phone: updateData.phone !== undefined ? updateData.phone : user.phone,
        profileImage: user.profile_image
      });
    } catch (error) {
      return errorResponse(res, error.message, 400, error);
    }
  }
}

module.exports = AuthController;
