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
    { email: '', password: '' },
    async (values) => {
      try {
        setServerError('');
        await login(values.email, values.password);
        navigate('/dashboard');
      } catch (err) {
        setServerError(err.message || 'Login failed');
      }
    },
    validateForm
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody>
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🧠</div>
            <h1 className="text-3xl font-bold text-gray-900">MEND</h1>
            <p className="text-gray-600 text-sm mt-2">Mental and Emotional Nurturing Digital</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>

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
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : ''}
              required
              fullWidth
            />

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <Link to="#" className="text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                Create one
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
