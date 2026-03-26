/**
 * Auth Context - Global authentication state
 */
import React, { createContext, useState, useEffect } from 'react';
import { getToken, getUser, setToken, setUser, clearAuth } from '../utils/auth';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();
    
    if (token && savedUser) {
      setCurrentUser(savedUser);
    }
    setLoading(false);
  }, []);

  const register = async (email, password, firstName, lastName) => {
    try {
      setError(null);
      const response = await authService.register(email, password, firstName, lastName);
      setToken(response.data.token);
      setUser(response.data.user);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      setToken(response.data.token);
      setUser(response.data.user);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    clearAuth();
    setCurrentUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
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
