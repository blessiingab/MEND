/**
 * Theme Context - Handle dark/light mode state
 */
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getPreferredTheme = () => {
    const saved = localStorage.getItem('theme-mode');
    if (saved) {
      return saved === 'dark';
    }

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return getPreferredTheme();
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme-mode', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme-mode', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    const handleSystemThemeChange = (event) => {
      if (!localStorage.getItem('theme-mode')) {
        setIsDarkMode(event.matches);
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === 'theme-mode') {
        setIsDarkMode(getPreferredTheme());
      }
    };

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if (mediaQuery?.addListener) {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else if (mediaQuery?.removeListener) {
        mediaQuery.removeListener(handleSystemThemeChange);
      }

      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
