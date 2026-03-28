/**
 * Login Page Component
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useCustomHooks';
import { useForm } from '../../hooks/useCustomHooks';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Card, CardBody } from '../common/Card';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md items-center justify-center">
        <Card className="w-full shadow-lg">
          <CardBody className="p-5 sm:p-6">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <Logo size="lg" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Mental and Emotional Nurturing Digital
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Welcome Back</h2>

          {(serverError || authError) && (
            <Alert
              type="error"
              title="Login Failed"
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
              label="Email Address"
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

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={values.rememberMe}
                  onChange={handleChange}
                  className="rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 sm:text-right"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={isSubmitting} size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300"
              >
                Create one
              </Link>
            </p>
          </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
