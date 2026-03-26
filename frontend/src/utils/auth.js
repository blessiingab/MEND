/**
 * Auth Utilities
 */

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  // Handle case where localStorage contains the string "undefined" or null
  if (!user || user === 'undefined') {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (err) {
    console.error('Failed to parse user data:', err);
    return null;
  }
};

export const clearAuth = () => {
  removeToken();
  localStorage.removeItem('user');
};
