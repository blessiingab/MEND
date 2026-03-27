/**
 * Auth Context - Global authentication state with JWT handling
 */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getToken, getUser, setToken, setUser, clearAuth } from '../utils/auth';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();
    
    if (token && savedUser) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (email, password, firstName, lastName, role = 'user', metadata = {}) => {
    try {
      setError(null);
      const response = await authService.register(email, password, firstName, lastName, role, metadata);
      const { token, user } = response;
      
      setToken(token);
      setUser(user);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email, password, rememberMe = false, role = 'user') => {
    try {
      setError(null);
      const response = await authService.login(email, password, role);
      const { token, user } = response;
      
      setToken(token, rememberMe);
      setUser(user, rememberMe);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    clearAuth();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await authService.updateProfile(userData);
      setUser(response);
      setCurrentUser(response);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Update failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      setError(null);
      await authService.changePassword(oldPassword, newPassword);
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Password change failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
