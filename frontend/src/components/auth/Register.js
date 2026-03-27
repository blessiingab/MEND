/**
 * Register Page Component
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
  if (!values.firstName) errors.firstName = 'First name is required';
  if (!values.lastName) errors.lastName = 'Last name is required';
  if (!values.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Email is invalid';
  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';
  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm password';
  else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  if (!values.role) errors.role = 'Please select a role';

  if (values.role === 'therapist') {
    if (!values.licenseNumber) errors.licenseNumber = 'License number is required for therapists';
    if (!values.specialization) errors.specialization = 'Specialization is required for therapists';
  }

  if (values.role === 'mentor') {
    if (!values.expertiseArea) errors.expertiseArea = 'Expertise area is required for mentors';
    if (!values.experienceYears) errors.experienceYears = 'Experience years is required for mentors';
    else if (isNaN(values.experienceYears) || Number(values.experienceYears) < 0) {
      errors.experienceYears = 'Enter a valid number of years';
    }
  }

  if (!values.agreeTerms) errors.agreeTerms = 'You must agree to terms';
  return errors;
};

export const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, register, error: authError, setError } = useAuth();
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
    { 
      firstName: '', 
      lastName: '', 
      email: '', 
      password: '',
      confirmPassword: '',
      role: 'user',
      agreeTerms: false,
      licenseNumber: '',
      specialization: '',
      expertiseArea: '',
      experienceYears: ''
    },
    async (values) => {
      try {
        setServerError('');
        const metadata = {};
        if (values.role === 'therapist') {
          metadata.licenseNumber = values.licenseNumber;
          metadata.specialization = values.specialization;
        }
        if (values.role === 'mentor') {
          metadata.expertiseArea = values.expertiseArea;
          metadata.experienceYears = Number(values.experienceYears);
        }

        await register(
          values.email,
          values.password,
          values.firstName,
          values.lastName,
          values.role,
          metadata
        );
        navigate('/dashboard');
      } catch (err) {
        setServerError(err.message || 'Registration failed');
      }
    },
    validateForm
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardBody>
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🧠</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MEND</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Join our community</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Create Account</h2>

          {(serverError || authError) && (
            <Alert
              type="error"
              title="Registration Failed"
              message={serverError || authError}
              onClose={() => {
                setServerError('');
                setError(null);
              }}
              dismissible
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                name="firstName"
                placeholder="John"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName ? errors.firstName : ''}
                required
                fullWidth
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName ? errors.lastName : ''}
                required
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                I am registering as a:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'role', value: 'user' } })}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    values.role === 'user'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">👤</div>
                  <div className="text-sm font-medium">User</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Access services</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'role', value: 'therapist' } })}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    values.role === 'therapist'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">🩺</div>
                  <div className="text-sm font-medium">Therapist</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Provide therapy</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'role', value: 'mentor' } })}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    values.role === 'mentor'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">🎓</div>
                  <div className="text-sm font-medium">Mentor</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Talent development</div>
                </button>
              </div>
              {touched.role && errors.role && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.role}</p>
              )}
            </div>

            {values.role === 'therapist' && (
              <>
                <Input
                  label="License Number"
                  name="licenseNumber"
                  placeholder="e.g., TH-12345"
                  value={values.licenseNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.licenseNumber ? errors.licenseNumber : ''}
                  required
                  fullWidth
                />
                <Input
                  label="Specialization"
                  name="specialization"
                  placeholder="e.g., Cognitive Behavioral Therapy"
                  value={values.specialization}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.specialization ? errors.specialization : ''}
                  required
                  fullWidth
                />
              </>
            )}

            {values.role === 'mentor' && (
              <>
                <Input
                  label="Expertise Area"
                  name="expertiseArea"
                  placeholder="e.g., Career Development"
                  value={values.expertiseArea}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.expertiseArea ? errors.expertiseArea : ''}
                  required
                  fullWidth
                />
                <Input
                  label="Experience Years"
                  name="experienceYears"
                  type="number"
                  placeholder="e.g., 5"
                  value={values.experienceYears}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.experienceYears ? errors.experienceYears : ''}
                  required
                  fullWidth
                />
              </>
            )}

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
              helperText="At least 8 characters"
              required
              fullWidth
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword ? errors.confirmPassword : ''}
              required
              fullWidth
            />

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={values.agreeTerms}
                onChange={handleChange}
                className="mt-1 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</button> and{' '}
                <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</button>
              </span>
            </label>
            {touched.agreeTerms && errors.agreeTerms && (
              <p className="text-red-500 dark:text-red-400 text-xs">{errors.agreeTerms}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300">
                Sign In
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
