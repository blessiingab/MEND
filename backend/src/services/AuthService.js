/**
 * Auth Service - Authentication business logic
 */
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { validateEmail, validatePassword } = require('../utils/validators');

class AuthService {
  static async register(userData) {
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
    } = userData;

    // Validation
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!validatePassword(password)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const newUser = await User.create({
      email,
      password,
      firstName: firstName || email.split('@')[0],
      lastName: lastName || '',
      role,
      bio,
      profileImage,
      licenseNumber,
      specialization,
      expertiseArea,
      experienceYears
    });

    // Generate token
    const token = generateToken(newUser.id, newUser.role);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role
      },
      token
    };
  }

  static async login(email, password) {
    // Validation
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    };
  }

  static async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await User.verifyPassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    if (!validatePassword(newPassword)) {
      throw new Error('New password does not meet requirements');
    }

    // Update password
    await User.updatePassword(userId, newPassword);

    return { message: 'Password changed successfully' };
  }
}

module.exports = AuthService;
