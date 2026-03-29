/**
 * Navigation Component
 */
import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useCustomHooks';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';
import { Logo } from './Logo';

const ROLE_LABELS = {
  admin: 'Admin',
  therapist: 'Therapist',
  mentor: 'Mentor',
  user: 'Member'
};

export const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = useMemo(() => {
    if (!isAuthenticated) {
      return [{ label: 'Home', href: '/' }];
    }

    if (user?.role === 'admin') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Admin', href: '/admin' },
        { label: 'Profile', href: '/profile' }
      ];
    }

    if (user?.role === 'therapist') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Sessions', href: '/sessions' },
        { label: 'Profile', href: '/profile' }
      ];
    }

    if (user?.role === 'mentor') {
      return [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Career', href: '/career' },
        { label: 'Talent Development', href: '/talent-development' },
        { label: 'Profile', href: '/profile' }
      ];
    }

    return [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Community', href: '/community' },
      { label: 'Assessments', href: '/assessments' },
      { label: 'Sessions', href: '/sessions' },
      { label: 'Career', href: '/career' },
      { label: 'Profile', href: '/profile' }
    ];
  }, [isAuthenticated, user?.role]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (href) => {
    const [targetPath, targetHash] = href.split('#');

    if (targetHash) {
      return pathname === targetPath && hash === `#${targetHash}`;
    }

    return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
  };

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.trim() || 'M';

  return (
    <nav className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="mx-auto max-w-7xl rounded-[30px] border border-white/70 bg-white/82 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72 dark:shadow-[0_18px_60px_rgba(2,6,23,0.45)]">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <Link to="/" className="min-w-0 shrink-0">
            <Logo size="sm" />
          </Link>

          <div className="hidden flex-1 justify-center lg:flex">
            <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-100/75 p-1.5 dark:border-slate-800 dark:bg-slate-900/80">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive(link.href)
                      ? 'bg-white text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300'
                      : 'text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.95 2.636a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM17 9a1 1 0 110 2h-1a1 1 0 110-2h1zm-7 6a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.657-.343a1 1 0 011.414 0l.707.707A1 1 0 014.05 16.78l-.707-.707a1 1 0 010-1.414zM4 9a1 1 0 110 2H3a1 1 0 110-2h1zm1.05-4.95a1 1 0 010 1.414l-.707.707A1 1 0 112.93 4.757l.707-.707a1 1 0 011.414 0zM10 6a4 4 0 110 8 4 4 0 010-8zm7.07 8.757a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-3 rounded-full border border-slate-200/90 bg-white/90 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/80 xl:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 font-bold text-white shadow-[0_10px_22px_rgba(37,99,235,0.24)]">
                    {initials}
                  </div>
                  <div className="pr-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {ROLE_LABELS[user?.role] || 'Member'}
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout} className="rounded-full px-5">
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm" className="rounded-full px-5">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full px-5">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.95 2.636a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM17 9a1 1 0 110 2h-1a1 1 0 110-2h1zm-7 6a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.657-.343a1 1 0 011.414 0l.707.707A1 1 0 014.05 16.78l-.707-.707a1 1 0 010-1.414zM4 9a1 1 0 110 2H3a1 1 0 110-2h1zm1.05-4.95a1 1 0 010 1.414l-.707.707A1 1 0 112.93 4.757l.707-.707a1 1 0 011.414 0zM10 6a4 4 0 110 8 4 4 0 010-8zm7.07 8.757a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200/80 px-4 pb-4 pt-3 dark:border-slate-800/80 md:hidden">
            {isAuthenticated && (
              <div className="mb-3 rounded-[24px] border border-slate-200/80 bg-slate-50/85 p-3 dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {ROLE_LABELS[user?.role] || 'Member'}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50/85 text-slate-700 dark:bg-slate-900/80 dark:text-slate-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-3">
              {isAuthenticated ? (
                <Button variant="secondary" fullWidth size="sm" onClick={handleLogout} className="rounded-2xl py-3">
                  Logout
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" fullWidth size="sm" className="rounded-2xl py-3">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button fullWidth size="sm" className="rounded-2xl py-3">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
