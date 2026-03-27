/**
 * Auth Utilities
 */

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const getStorage = (rememberMe = true) => (rememberMe ? window.localStorage : window.sessionStorage);

export const setToken = (token, rememberMe = true) => {
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  getStorage(rememberMe).setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const setUser = (user, rememberMe = true) => {
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  getStorage(rememberMe).setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = window.localStorage.getItem(USER_KEY) || window.sessionStorage.getItem(USER_KEY);
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
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(USER_KEY);
};
