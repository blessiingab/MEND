/**
 * Navigation Component
 */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useCustomHooks';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';

export const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = isAuthenticated ? [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Assessments', href: '/assessments' },
    { label: 'Therapy', href: '/sessions' },
    { label: 'Community', href: '/community' },
    { label: 'Career', href: '/career' },
  ] : [
    { label: 'Home', href: '/' },
  ];

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
            <span className="text-2xl">🧠</span>
            MEND
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-4'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 pb-4'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.829a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 7a3 3 0 110 6 3 3 0 010-6zm-4.22-1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L5.78 5.22a1 1 0 010-1.414zm11.313 11.313a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm1.414-9.9a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414zM17 11a1 1 0 110-2h1a1 1 0 110 2h-1zm-6 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM9 20a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM5.64 7.64a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role === 'admin' ? 'Admin' : user?.role === 'therapist' ? 'Therapist' : user?.role === 'mentor' ? 'Mentor' : 'User'}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {user?.firstName?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                <Link to="/profile" className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition">
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block py-2 px-4 text-sm font-medium ${
                  isActive(link.href)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-2 flex items-center gap-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-1 flex justify-center"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.829a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 7a3 3 0 110 6 3 3 0 010-6zm-4.22-1.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L5.78 5.22a1 1 0 010-1.414zm11.313 11.313a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm1.414-9.9a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414zM17 11a1 1 0 110-2h1a1 1 0 110 2h-1zm-6 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM9 20a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM5.64 7.64a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <div className="flex-1">
                {isAuthenticated ? (
                  <Button
                    variant="secondary"
                    fullWidth
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1">
                      <Button className="w-full" variant="secondary" size="sm">Login</Button>
                    </Link>
                    <Link to="/register" className="flex-1">
                      <Button className="w-full" size="sm">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
