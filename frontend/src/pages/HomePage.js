/**
 * Home Page - Landing Page
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaComments,
  FaHeart,
  FaMoon,
  FaShieldAlt,
  FaStethoscope,
  FaSun,
  FaUserMd,
  FaUsers
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { Logo } from '../components/common/Logo';

const audienceCards = [
  {
    title: 'Individuals',
    description: 'Get guided support across assessments, therapy, community, and career planning without stitching tools together yourself.',
    icon: FaHeart,
    accent: 'from-blue-600/15 via-sky-500/10 to-transparent',
    items: ['Evidence-based check-ins', 'Visible progress history', 'Secure support journeys']
  },
  {
    title: 'Therapists',
    description: 'Manage client sessions, group care, and follow-up notes from a workspace built to stay calm under real clinical work.',
    icon: FaUserMd,
    accent: 'from-emerald-600/15 via-teal-500/10 to-transparent',
    items: ['Session coordination', 'Care group visibility', 'Protected communication']
  },
  {
    title: 'Mentors',
    description: 'Turn career guidance into structured growth with saved plans, milestones, and a clearer view of next steps.',
    icon: FaChartLine,
    accent: 'from-violet-600/15 via-fuchsia-500/10 to-transparent',
    items: ['Career path templates', 'Actionable guidance', 'Progress milestones']
  }
];

const featureCards = [
  {
    title: 'Assess mental wellness',
    description: 'Use PHQ-9 and GAD-7 flows with clearer scoring, fast history access, and progress that feels readable.',
    icon: FaStethoscope
  },
  {
    title: 'Coordinate real support',
    description: 'Book therapy, manage schedules, and stay organized whether you are receiving care or delivering it.',
    icon: FaUsers
  },
  {
    title: 'Connect through community',
    description: 'Share stories, creativity, and encouragement in a moderated space designed to feel steady and human.',
    icon: FaComments
  },
  {
    title: 'Protect privacy by default',
    description: 'Sensitive journeys need trust, so the platform emphasizes secure access and clear role-based experiences.',
    icon: FaShieldAlt
  }
];

const journeySteps = [
  'Create your account and choose the role that matches how you want to use MEND.',
  'Start with an assessment, a therapy session, or a career guidance path.',
  'Track your momentum over time with calmer dashboards and progress views.',
  'Return to one place for care, insight, and community as your needs change.'
];

const footerGroups = [
  { title: 'Platform', items: ['Assessments', 'Therapy', 'Community', 'Career Guidance'] },
  { title: 'Experience', items: ['Secure Access', 'Role-Based Workflows', 'Progress Tracking', 'Dark Mode'] },
  { title: 'Support', items: ['Help Center', 'Contact', 'Privacy', 'Terms'] }
];

export const HomePage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const homeNavLinks = useMemo(
    () => [
      { label: 'Who It Helps', href: '#audiences' },
      { label: 'What You Get', href: '#features' },
      { label: 'How It Flows', href: '#journey' }
    ],
    []
  );

  const renderCtas = () =>
    (
      <div className="flex flex-wrap gap-3">
        <Link to="/register">
          <Button size="lg" className="rounded-full px-7 py-4 text-base">
            Start Free
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" size="lg" className="rounded-full px-7 py-4 text-base">
            Log In
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen overflow-hidden bg-white dark:bg-slate-950">
      <section className="relative isolate border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_46%,#ffffff_100%)] pb-20 pt-6 dark:border-slate-800/70 dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(13,148,136,0.12),transparent_22%),linear-gradient(180deg,#07111f_0%,#0f172a_48%,#111827_100%)]">
        <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="sticky top-4 z-30 rounded-[30px] border border-white/70 bg-white/82 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/74 dark:shadow-[0_18px_60px_rgba(2,6,23,0.45)]">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <Link to="/" className="min-w-0">
                <Logo size="sm" />
              </Link>

              <div className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-slate-100/75 p-1.5 lg:flex dark:border-slate-800 dark:bg-slate-900/80">
                {homeNavLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <button
                  onClick={toggleTheme}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <FaSun className="h-4 w-4 text-amber-400" /> : <FaMoon className="h-4 w-4" />}
                </button>
                <>
                  <Link to="/login">
                    <Button variant="secondary" size="sm" className="rounded-full px-5">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="rounded-full px-5">
                      Join MEND
                    </Button>
                  </Link>
                </>
              </div>

              <div className="flex items-center gap-2 md:hidden">
                <button
                  onClick={toggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <FaSun className="h-4 w-4 text-amber-400" /> : <FaMoon className="h-4 w-4" />}
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
                <div className="flex flex-col gap-2">
                  {homeNavLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-2xl bg-slate-50/90 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="secondary" fullWidth size="sm" className="rounded-2xl py-3">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button fullWidth size="sm" className="rounded-2xl py-3">
                        Join MEND
                      </Button>
                    </Link>
                  </>
                </div>
              </div>
            )}
          </nav>
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="relative z-10 pt-4">
            <span className="eyebrow-pill">
              <FaCheckCircle className="h-3.5 w-3.5" />
              Care and growth in one place
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.96] text-slate-950 dark:text-slate-50 md:text-7xl">
              Mental wellness that keeps up with real life.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 md:text-xl">
              MEND brings together assessments, therapy coordination, community support, and career guidance in a calmer experience that feels built for people, not just pages.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {renderCtas()}
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300"
              >
                Explore the platform
                <FaArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                ['2', 'validated assessments'],
                ['3', 'core user journeys'],
                ['1', 'connected support hub']
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`stagger-fade rounded-[24px] border border-white/70 bg-white/78 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/70 ${index === 1 ? 'delay-1' : index === 2 ? 'delay-2' : ''}`}
                >
                  <p className="text-3xl font-black text-slate-950 dark:text-slate-50">{value}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-8 hidden h-28 w-28 rounded-full bg-blue-500/15 blur-3xl lg:block" />
            <div className="absolute -right-4 bottom-12 hidden h-32 w-32 rounded-full bg-teal-500/15 blur-3xl lg:block" />
            <div className="relative overflow-hidden rounded-[36px] border border-white/75 bg-slate-950 p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] dark:border-slate-800/80">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.24),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.22),transparent_24%)]" />
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-blue-100/80">MEND workspace</p>
                    <h2 className="mt-3 text-2xl font-bold">From first check-in to steady momentum.</h2>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
                    Always connected
                  </span>
                </div>

                <div className="mt-8 grid gap-4">
                  <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-300">Assessment pulse</p>
                        <p className="mt-2 text-3xl font-black">Stable check-ins</p>
                      </div>
                      <div className="rounded-2xl bg-emerald-400/14 p-3 text-emerald-200">
                        <FaStethoscope className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-300" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                      <p className="text-sm text-slate-300">Therapy flow</p>
                      <p className="mt-2 text-xl font-bold">Sessions, notes, and follow-up in one loop.</p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                      <p className="text-sm text-slate-300">Career guidance</p>
                      <p className="mt-2 text-xl font-bold">Move from advice to milestones you can track.</p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                    <p className="text-sm text-slate-300">Why this redesign matters</p>
                    <ul className="mt-4 space-y-3 text-sm text-slate-100">
                      {[
                        'Stronger visual hierarchy across landing, auth, and product surfaces.',
                        'A cleaner navigation shell for signed-in roles.',
                        'More polished cards, alerts, and inputs across the experience.'
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-0.5 rounded-full bg-white/15 p-1">
                            <FaCheckCircle className="h-3.5 w-3.5 text-emerald-300" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="audiences" className="scroll-mt-28 bg-slate-50 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="eyebrow-pill">Who MEND helps</span>
            <h2 className="mt-5 text-4xl font-black text-slate-950 dark:text-slate-50">Built for different roles without feeling fragmented.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Each workflow now feels part of the same product language while still giving users, therapists, and mentors the tools that match their work.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {audienceCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <Card key={card.title} hoverable className={`stagger-fade bg-gradient-to-br ${card.accent} ${index === 1 ? 'delay-1' : index === 2 ? 'delay-2' : ''}`}>
                  <CardBody className="space-y-5">
                    <div className="inline-flex rounded-[22px] bg-slate-950 p-3 text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)] dark:bg-slate-100 dark:text-slate-950">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{card.title}</h3>
                      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{card.description}</p>
                    </div>
                    <div className="space-y-3">
                      {card.items.map((item) => (
                        <div key={item} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <span className="mt-0.5 rounded-full bg-blue-600/10 p-1 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                            <FaCheckCircle className="h-3.5 w-3.5" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-28 bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="eyebrow-pill">What you get</span>
              <h2 className="mt-5 text-4xl font-black text-slate-950 dark:text-slate-50">A steadier interface across the full support journey.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
                The redesign sharpens hierarchy, improves readability, and brings the whole product into one clear visual system.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <Card key={feature.title} hoverable className={index % 2 === 1 ? 'sm:translate-y-8' : ''}>
                    <CardBody className="space-y-4">
                      <div className="inline-flex rounded-[22px] bg-gradient-to-br from-blue-600 to-teal-500 p-3 text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-950 dark:text-slate-50">{feature.title}</h3>
                      <p className="leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="scroll-mt-28 bg-slate-50 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="eyebrow-pill">How it flows</span>
            <h2 className="mt-5 text-4xl font-black text-slate-950 dark:text-slate-50">A simpler path from arrival to progress.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {journeySteps.map((step, index) => (
              <div
                key={step}
                className="rounded-[28px] border border-white/70 bg-white/82 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.07)] backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/76"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-lg font-bold text-white shadow-[0_12px_24px_rgba(37,99,235,0.2)]">
                  {index + 1}
                </div>
                <p className="mt-5 leading-7 text-slate-700 dark:text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[36px] border border-blue-200/70 bg-gradient-to-br from-blue-600 via-sky-500 to-teal-500 px-8 py-10 text-white shadow-[0_28px_80px_rgba(37,99,235,0.26)] dark:border-slate-800/70 md:px-12 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_28%)]" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
                  Ready when you are
                </span>
                <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">A better-looking MEND is only useful if it still feels easy to use.</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
                  The refreshed UI keeps the product grounded in clarity, role-based navigation, and flows that stay readable on desktop and mobile.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/20 bg-slate-950/16 p-6 backdrop-blur-md">
                <div className="space-y-4">
                  {[
                    'Cleaner homepage story and stronger first impression',
                    'More polished auth pages and shared component styling',
                    'Navigation that better supports signed-in workflows'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 rounded-full bg-white/15 p-1.5">
                        <FaCheckCircle className="h-4 w-4 text-emerald-200" />
                      </span>
                      <span className="text-sm text-blue-50">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">{renderCtas()}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-slate-950 py-16 text-slate-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.12),transparent_24%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <Logo size="md" className="mb-5" />
              <p className="max-w-sm text-sm leading-7 text-slate-400">
                MEND stands for Mental and Emotional Nurturing Digital. The platform is designed to keep care, connection, and growth within reach.
              </p>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">{group.title}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-slate-400">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-8 text-sm text-slate-400">
            Copyright 2026 MEND. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
