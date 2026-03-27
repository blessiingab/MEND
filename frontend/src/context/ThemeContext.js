/**
 * Theme Context - Handle dark/light mode state
 */
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme-mode');
    if (saved) {
      return saved === 'dark';
    }
    // Default to light mode
    return false;
  });

  useEffect(() => {
    // Update DOM class and localStorage when theme changes
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme-mode', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme-mode', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
