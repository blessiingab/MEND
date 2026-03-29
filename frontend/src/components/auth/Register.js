/**
 * Register Page Component
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaMoon,
  FaStar,
  FaSun,
  FaUser,
  FaUserMd
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useCustomHooks';
import { useForm } from '../../hooks/useCustomHooks';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { CardBody } from '../common/Card';
import { Logo } from '../common/Logo';

const ROLE_OPTIONS = [
  {
    value: 'user',
    label: 'User',
    description: 'Access assessments, therapy, community, and career support.',
    icon: FaUser
  },
  {
    value: 'therapist',
    label: 'Therapist',
    description: 'Provide care, manage sessions, and support clients.',
    icon: FaUserMd
  },
  {
    value: 'mentor',
    label: 'Mentor',
    description: 'Guide career growth and talent development plans.',
    icon: FaChartLine
  }
];

const validateForm = (values) => {
  const errors = {};
  const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!values.firstName) errors.firstName = 'First name is required';
  if (!values.lastName) errors.lastName = 'Last name is required';
  if (!values.email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Email is invalid';
  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';
  else if (!strongPasswordPattern.test(values.password)) {
    errors.password = 'Password must include uppercase, lowercase, and a number';
  }
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
    else if (Number.isNaN(Number(values.experienceYears)) || Number(values.experienceYears) < 0) {
      errors.experienceYears = 'Enter a valid number of years';
    }
  }

  if (!values.agreeTerms) errors.agreeTerms = 'You must agree to terms';
  return errors;
};

export const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, register, error: authError, setError } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
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
    async (submittedValues) => {
      try {
        setServerError('');
        const metadata = {};

        if (submittedValues.role === 'therapist') {
          metadata.licenseNumber = submittedValues.licenseNumber;
          metadata.specialization = submittedValues.specialization;
        }

        if (submittedValues.role === 'mentor') {
          metadata.expertiseArea = submittedValues.expertiseArea;
          metadata.experienceYears = Number(submittedValues.experienceYears);
        }

        await register(
          submittedValues.email,
          submittedValues.password,
          submittedValues.firstName,
          submittedValues.lastName,
          submittedValues.role,
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

        <div className="grid gap-6 xl:grid-cols-[0.86fr_1fr] xl:items-start">
          <section className="auth-showcase hidden xl:block">
            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                  <FaStar className="h-3.5 w-3.5" />
                  Join MEND
                </span>
                <h1 className="mt-6 max-w-xl text-5xl font-black leading-[0.96] text-white">
                  Start with the role that fits how you want to help or heal.
                </h1>
                <p className="mt-5 max-w-lg text-lg leading-8 text-slate-200">
                  The new onboarding flow makes role selection clearer while keeping the form grounded and easier to scan.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  'Users can move directly into wellness and career tools.',
                  'Therapists can enter credentials and begin care workflows.',
                  'Mentors can describe expertise and guide growth with structure.'
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
                  <FaArrowRight className="h-3.5 w-3.5" />
                  Create account
                </span>
                <h2 className="mt-5 text-3xl font-black text-slate-950 dark:text-slate-50">Build your MEND workspace</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Choose a role, add your details, and step into a cleaner platform experience.
                </p>
              </div>

              {(serverError || authError) && (
                <Alert
                  type="error"
                  title="Registration failed"
                  message={serverError || authError}
                  onClose={() => {
                    setServerError('');
                    setError(null);
                  }}
                  dismissible
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="First name"
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
                    label="Last name"
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
                  <p className="mb-3 text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">
                    Choose your role
                  </p>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {ROLE_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const selected = values.role === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleChange({ target: { name: 'role', value: option.value } })}
                          className={`rounded-[24px] border p-4 text-left transition ${
                            selected
                              ? 'border-blue-500 bg-blue-50/90 shadow-[0_12px_30px_rgba(37,99,235,0.12)] dark:border-blue-500 dark:bg-blue-500/10'
                              : 'border-slate-200/90 bg-white/72 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-950/60 dark:hover:border-blue-500'
                          }`}
                        >
                          <span className={`inline-flex rounded-2xl p-3 ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <p className="mt-4 text-base font-bold text-slate-950 dark:text-slate-50">{option.label}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                  {touched.role && errors.role && (
                    <p className="mt-2 text-xs font-medium text-rose-500 dark:text-rose-300">{errors.role}</p>
                  )}
                </div>

                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : ''}
                  required
                  fullWidth
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password ? errors.password : ''}
                    helperText="Use at least 8 characters with upper, lower, and number."
                    required
                    fullWidth
                  />
                  <Input
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat your password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword ? errors.confirmPassword : ''}
                    required
                    fullWidth
                  />
                </div>

                {values.role === 'therapist' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="License number"
                      name="licenseNumber"
                      placeholder="TH-12345"
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
                      placeholder="Cognitive behavioral therapy"
                      value={values.specialization}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.specialization ? errors.specialization : ''}
                      required
                      fullWidth
                    />
                  </div>
                )}

                {values.role === 'mentor' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Expertise area"
                      name="expertiseArea"
                      placeholder="Career development"
                      value={values.expertiseArea}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.expertiseArea ? errors.expertiseArea : ''}
                      required
                      fullWidth
                    />
                    <Input
                      label="Years of experience"
                      name="experienceYears"
                      type="number"
                      placeholder="5"
                      value={values.experienceYears}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.experienceYears ? errors.experienceYears : ''}
                      required
                      fullWidth
                    />
                  </div>
                )}

                <label className="flex items-start gap-3 rounded-[24px] border border-slate-200/90 bg-slate-50/75 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={values.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span>
                    I agree to the platform terms, privacy expectations, and responsible use of MEND.
                    {touched.agreeTerms && errors.agreeTerms && (
                      <span className="mt-2 block text-xs font-medium text-rose-500 dark:text-rose-300">
                        {errors.agreeTerms}
                      </span>
                    )}
                  </span>
                </label>

                <Button type="submit" variant="primary" fullWidth loading={isSubmitting} size="lg" className="rounded-2xl py-3.5">
                  Create Account
                </Button>
              </form>

              <div className="mt-8 rounded-[24px] border border-slate-200/80 bg-slate-50/75 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                  >
                    Sign in
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
