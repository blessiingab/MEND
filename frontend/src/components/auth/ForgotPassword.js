import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../../hooks/useCustomHooks';
import { authService } from '../../services/api';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Card, CardBody } from '../common/Card';

const validateForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  return errors;
};

export const ForgotPassword = () => {
  const [serverMessage, setServerMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [previewResetUrl, setPreviewResetUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '' },
    async (submittedValues) => {
      setServerError('');
      setServerMessage('');
      setPreviewResetUrl('');
      setExpiresAt('');

      try {
        const appUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
        const response = await authService.forgotPassword(submittedValues.email, appUrl);
        setServerMessage(
          response?.message || 'If an account with that email exists, password reset instructions have been prepared.'
        );
        setPreviewResetUrl(response?.previewResetUrl || '');
        setExpiresAt(response?.expiresAt || '');
      } catch (err) {
        setServerError(err.message || 'Unable to start password reset.');
      }
    },
    validateForm
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody>
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">Reset</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Enter your account email and we will prepare a secure recovery link.
            </p>
          </div>

          {serverError && (
            <Alert
              type="error"
              title="Reset Unavailable"
              message={serverError}
              dismissible
              onClose={() => setServerError('')}
            />
          )}

          {serverMessage && (
            <Alert
              type="success"
              title="Recovery Started"
              message={serverMessage}
              dismissible
              onClose={() => setServerMessage('')}
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

            <Button type="submit" variant="primary" fullWidth loading={isSubmitting} size="lg">
              Send Recovery Link
            </Button>
          </form>

          {previewResetUrl && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900 dark:border-blue-700 p-4">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Recovery Link Preview</p>
              <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
                This preview is shown because email delivery is not configured in this environment.
              </p>
              {expiresAt && (
                <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
                  Expires: {new Date(expiresAt).toLocaleString()}
                </p>
              )}
              <a
                href={previewResetUrl}
                className="block mt-3 break-all text-sm text-blue-700 dark:text-blue-200 hover:underline"
              >
                {previewResetUrl}
              </a>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Remembered your password?{' '}
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
