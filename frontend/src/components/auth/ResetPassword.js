import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from '../../hooks/useCustomHooks';
import { authService } from '../../services/api';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Card, CardBody } from '../common/Card';

const validateForm = (values) => {
  const errors = {};

  if (!values.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(values.newPassword)) {
    errors.newPassword = 'Use 8+ characters with uppercase, lowercase, and number';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm the new password';
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { newPassword: '', confirmPassword: '' },
    async (submittedValues) => {
      setServerError('');
      setServerMessage('');

      try {
        await authService.resetPassword(token, submittedValues.newPassword);
        setServerMessage('Your password has been reset successfully. Redirecting to sign in...');
        window.setTimeout(() => navigate('/login'), 1200);
      } catch (err) {
        setServerError(err.message || 'Unable to reset password.');
      }
    },
    validateForm
  );

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardBody>
            <Alert
              type="error"
              title="Invalid Reset Link"
              message="This password reset link is missing a token. Request a new one to continue."
            />
            <div className="mt-6 text-center">
              <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Request a new recovery link
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody>
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">Lock</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Choose a new password for your account.
            </p>
          </div>

          {serverError && (
            <Alert
              type="error"
              title="Reset Failed"
              message={serverError}
              dismissible
              onClose={() => setServerError('')}
            />
          )}

          {serverMessage && (
            <Alert
              type="success"
              title="Password Updated"
              message={serverMessage}
              dismissible
              onClose={() => setServerMessage('')}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              placeholder="Enter a strong password"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.newPassword ? errors.newPassword : ''}
              helperText="Use at least 8 characters with uppercase, lowercase, and a number."
              required
              fullWidth
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword ? errors.confirmPassword : ''}
              required
              fullWidth
            />

            <Button type="submit" variant="primary" fullWidth loading={isSubmitting} size="lg">
              Reset Password
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400">
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Back to sign in
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
