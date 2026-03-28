/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * Home Page - Landing Page
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useCustomHooks';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { Logo } from '../components/common/Logo';

const featureHighlights = [
  { icon: '📊', title: 'Evidence-Based', text: 'Clinically validated assessments' },
  { icon: '🔒', title: 'HIPAA Compliant', text: 'Your privacy is protected' },
  { icon: '🌟', title: '24/7 Support', text: 'Access help anytime' }
];

const audiences = [
  {
    icon: '👤',
    title: 'Individuals',
    text: 'Access mental health assessments, therapy sessions, career guidance, and connect with our supportive community.',
    accent: 'hover:border-blue-200 dark:hover:border-blue-500/60',
    items: ['Self-assessment tools', 'Progress tracking', 'Community support', 'Career resources']
  },
  {
    icon: '🩺',
    title: 'Therapists',
    text: 'Licensed professionals can offer their expertise, manage sessions, and help clients on their healing journey.',
    accent: 'hover:border-green-200 dark:hover:border-emerald-500/60',
    items: ['Session management', 'Client progress tracking', 'Secure communication', 'Professional network']
  },
  {
    icon: '🎓',
    title: 'Mentors',
    text: 'Career mentors provide guidance and support to help individuals achieve their professional goals.',
    accent: 'hover:border-purple-200 dark:hover:border-fuchsia-500/60',
    items: ['Career counseling', 'Skill development', 'Goal setting', 'Professional networking']
  }
];

const platformFeatures = [
  {
    icon: '📊',
    title: 'Mental Health Assessments',
    text: 'Take evidence-based assessments like PHQ-9 and GAD-7 to understand your mental health status and track progress over time.'
  },
  {
    icon: '👨‍⚕️',
    title: 'Professional Therapy',
    text: 'Connect with licensed therapists and book personalized therapy sessions at your convenience through our secure platform.'
  },
  {
    icon: '🎨',
    title: 'Creative Community',
    text: 'Share your stories, express yourself through creative posts, and connect with others in our supportive, moderated community.'
  },
  {
    icon: '🚀',
    title: 'Career Guidance',
    text: 'Get personalized career recommendations, skill assessments, and guidance from experienced mentors to achieve your goals.'
  },
  {
    icon: '📈',
    title: 'Progress Analytics',
    text: 'Monitor your mental health journey with detailed analytics, progress reports, and insights to celebrate your achievements.'
  },
  {
    icon: '🔒',
    title: 'Privacy & Security',
    text: 'Your data is encrypted, HIPAA-compliant, and secure. We never share your personal information without explicit consent.'
  }
];

const journeySteps = [
  {
    title: 'Create Account',
    text: 'Sign up as a user, therapist, or mentor and complete your profile in minutes.'
  },
  {
    title: 'Assess & Connect',
    text: 'Take assessments, book therapy sessions, or start providing guidance based on your role.'
  },
  {
    title: 'Track Progress',
    text: 'Monitor your journey with detailed analytics and celebrate milestones along the way.'
  },
  {
    title: 'Grow & Thrive',
    text: 'Achieve your mental health and career goals with ongoing support from our community.'
  }
];

const footerGroups = [
  { title: 'Platform', items: ['Assessments', 'Therapy', 'Community', 'Career'] },
  { title: 'Support', items: ['Help Center', 'Contact Us', 'Emergency', 'Resources'] },
  { title: 'Legal', items: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Security'] }
];

const socialLinks = ['Facebook', 'Twitter', 'LinkedIn', 'Instagram'];

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const homeNavLinks = [
    { label: 'Who We Serve', href: '#who-we-serve' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-6 pb-16 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <nav className="sticky top-4 z-40 rounded-[28px] border border-white/60 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/75 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_60px_rgba(2,6,23,0.45)]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
              <Link to="/" className="flex items-center min-w-0">
                <Logo size="sm" />
              </Link>

              <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-100/80 dark:bg-slate-900/80 px-2 py-2">
                {homeNavLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="h-11 w-11 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-500 transition-colors flex items-center justify-center"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.95 2.636a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM17 9a1 1 0 110 2h-1a1 1 0 110-2h1zm-7 6a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.657-.343a1 1 0 011.414 0l.707.707A1 1 0 014.05 16.78l-.707-.707a1 1 0 010-1.414zM4 9a1 1 0 110 2H3a1 1 0 110-2h1zm1.05-4.95a1 1 0 010 1.414l-.707.707A1 1 0 112.93 4.757l.707-.707a1 1 0 011.414 0zM10 6a4 4 0 110 8 4 4 0 010-8zm7.07 8.757a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>

                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="sm" className="rounded-full px-5 py-3 shadow-lg shadow-blue-500/20">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="secondary" size="sm" className="rounded-full px-5 py-3 bg-white/80 dark:bg-slate-900/80">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm" className="rounded-full px-5 py-3 shadow-lg shadow-blue-500/20">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 flex items-center justify-center"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.95 2.636a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM17 9a1 1 0 110 2h-1a1 1 0 110-2h1zm-7 6a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.657-.343a1 1 0 011.414 0l.707.707A1 1 0 014.05 16.78l-.707-.707a1 1 0 010-1.414zM4 9a1 1 0 110 2H3a1 1 0 110-2h1zm1.05-4.95a1 1 0 010 1.414l-.707.707A1 1 0 112.93 4.757l.707-.707a1 1 0 011.414 0zM10 6a4 4 0 110 8 4 4 0 010-8zm7.07 8.757a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 flex items-center justify-center"
                  aria-label="Toggle menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800/80 px-4 pb-4 pt-3">
                <div className="flex flex-col gap-2">
                  {homeNavLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-900/80"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  {isAuthenticated ? (
                    <Link to="/dashboard" className="flex-1">
                      <Button fullWidth size="sm" className="rounded-2xl py-3">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" className="flex-1">
                        <Button variant="secondary" fullWidth size="sm" className="rounded-2xl py-3 bg-white/80 dark:bg-slate-900/80">
                          Login
                        </Button>
                      </Link>
                      <Link to="/register" className="flex-1">
                        <Button fullWidth size="sm" className="rounded-2xl py-3">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Logo size="lg" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-slate-50 mb-6 leading-tight">
              Your Mental Health
              <span className="text-blue-600 dark:text-blue-400 block">Journey Starts Here</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              MEND provides comprehensive mental health support through evidence-based assessments,
              professional therapy sessions, career guidance, and a supportive community, all in one
              secure platform.
            </p>

            <div className="flex gap-4 justify-center flex-wrap mb-12">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="primary" size="lg" className="px-8 py-4 text-lg">
                    Continue to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="primary" size="lg" className="px-8 py-4 text-lg">
                      Start Your Journey Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              {featureHighlights.map((item) => (
                <div
                  key={item.title}
                  className="bg-white dark:bg-slate-900/80 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-800"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-semibold text-gray-900 dark:text-slate-100">{item.title}</div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="who-we-serve" className="py-16 bg-gray-50 dark:bg-slate-900 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-4">Who We Serve</h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              Join our diverse community of individuals seeking mental wellness and professionals
              dedicated to helping others.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {audiences.map((audience) => (
              <Card
                key={audience.title}
                className={`text-center border-2 border-gray-200 dark:border-slate-800 dark:bg-slate-950 ${audience.accent} transition-colors`}
              >
                <CardBody className="p-8">
                  <div className="text-5xl mb-4">{audience.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                    {audience.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 mb-4">{audience.text}</p>
                  <ul className="text-left text-sm text-gray-600 dark:text-slate-400 space-y-2">
                    {audience.items.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-white dark:bg-slate-950 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-4">
              Comprehensive Mental Health Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need for mental wellness in one integrated platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature) => (
              <Card
                key={feature.title}
                hoverable
                className="h-full border border-gray-200 dark:border-slate-800 dark:bg-slate-900/80"
              >
                <CardBody>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300">{feature.text}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-gray-50 dark:bg-slate-900 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              Getting started is simple. Follow these steps to begin your mental health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {journeySteps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-300">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[36px] border border-blue-200/70 dark:border-slate-800 bg-gradient-to-br from-blue-600 via-sky-500 to-teal-500 text-white px-8 py-10 md:px-12 md:py-14 shadow-[0_28px_80px_rgba(37,99,235,0.26)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_28%)]" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr] gap-10 items-center">
              <div>
                <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
                  Start With Confidence
                </span>
                <h2 className="text-4xl md:text-5xl font-black mt-5 leading-tight">Ready to Start Your Journey?</h2>
                <p className="text-lg md:text-xl mt-5 text-blue-50 max-w-2xl leading-relaxed">
                  Join thousands of people who have transformed their mental health and career with MEND.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/20 bg-slate-950/16 backdrop-blur-md p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-blue-100/80">What You Get</p>
                    <p className="text-2xl font-bold mt-2">Care, guidance, and community in one place.</p>
                  </div>
                  <Link to="/register">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full px-8 py-4 text-lg bg-white text-blue-700 hover:bg-slate-100 dark:bg-slate-100 dark:text-blue-900 dark:hover:bg-slate-200"
                    >
                      Create Your Free Account
                    </Button>
                  </Link>
                  <p className="text-sm text-blue-50/85">No credit card required - 14-day free trial</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-slate-950 text-gray-300 py-16 dark:bg-slate-950 dark:text-slate-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_24%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-10 mb-10">
            <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-md p-6">
              <Logo size="md" className="mb-5" />
              <p className="text-gray-400 dark:text-slate-400 text-sm leading-7">
                Mental and Emotional Nurturing Digital - Your comprehensive mental health companion.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">Assess</span>
                <span className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-200">Support</span>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">Grow</span>
              </div>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="font-semibold text-white dark:text-slate-100 mb-4 uppercase tracking-[0.2em] text-xs">{group.title}</h4>
                <ul className="space-y-2 text-sm">
                  {group.items.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white dark:hover:text-slate-100 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 dark:border-slate-800 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-gray-400 dark:text-slate-400 text-sm">
              &copy; 2026 MEND - Mental and Emotional Nurturing Digital. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-gray-400 dark:text-slate-400 hover:text-white dark:hover:text-slate-100 hover:border-blue-400/40 transition text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
