/**
 * Login Page Component
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaMoon, FaShieldAlt, FaSun } from 'react-icons/fa';
import { useAuth } from '../../hooks/useCustomHooks';
import { useForm } from '../../hooks/useCustomHooks';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { CardBody } from '../common/Card';
import { Logo } from '../common/Logo';

const validateForm = (values) => {
  const errors = {};
  if (!values.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Email is invalid';
  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
};

export const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, error: authError, setError } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '', rememberMe: false },
    async (submittedValues) => {
      try {
        setServerError('');
        await login(submittedValues.email, submittedValues.password, submittedValues.rememberMe);
        navigate('/dashboard');
      } catch (err) {
        setServerError(err.message || 'Login failed');
      }
    },
    validateForm
  );

  return (
    <div className="auth-shell px-4 py-6 sm:px-6 sm:py-8">
      <div className="auth-layout">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <button
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/82 text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950/78 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FaSun className="h-4 w-4 text-amber-400" /> : <FaMoon className="h-4 w-4" />}
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_0.75fr] xl:items-stretch">
          <section className="auth-showcase hidden xl:block">
            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                  <FaShieldAlt className="h-3.5 w-3.5" />
                  Secure return
                </span>
                <h1 className="mt-6 max-w-xl text-5xl font-black leading-[0.96] text-white">
                  Welcome back to a calmer MEND experience.
                </h1>
                <p className="mt-5 max-w-lg text-lg leading-8 text-slate-200">
                  Sign in to continue your support journey with improved navigation, cleaner pages, and a more focused workspace.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  'Move quickly from login into your dashboard.',
                  'Stay grounded with cleaner cards, forms, and alerts.',
                  'Keep therapy, assessments, community, and career in one system.'
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                    <span className="mt-0.5 rounded-full bg-white/15 p-1.5">
                      <FaCheckCircle className="h-4 w-4 text-emerald-200" />
                    </span>
                    <p className="text-sm leading-7 text-slate-100">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="auth-card">
            <CardBody className="p-6 sm:p-8">
              <div className="mb-8">
                <span className="eyebrow-pill">
                  <FaLock className="h-3.5 w-3.5" />
                  Sign in
                </span>
                <h2 className="mt-5 text-3xl font-black text-slate-950 dark:text-slate-50">Continue your journey</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Use your email and password to access your personalized MEND workspace.
                </p>
              </div>

              {(serverError || authError) && (
                <Alert
                  type="error"
                  title="Login failed"
                  message={serverError || authError}
                  onClose={() => {
                    setServerError('');
                    setError(null);
                  }}
                  dismissible
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : ''}
                  required
                  fullWidth
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password ? errors.password : ''}
                  required
                  fullWidth
                />

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={values.rememberMe}
                      onChange={handleChange}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                    />
                    <span>Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" variant="primary" fullWidth loading={isSubmitting} size="lg" className="rounded-2xl py-3.5">
                  Sign In
                </Button>
              </form>

              <div className="mt-8 rounded-[24px] border border-slate-200/80 bg-slate-50/75 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  New to MEND?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                  >
                    Create your account
                  </Link>
                </p>
              </div>
            </CardBody>
          </div>
        </div>
      </div>
    </div>
  );
};
