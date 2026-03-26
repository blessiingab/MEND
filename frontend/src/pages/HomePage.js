/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * Home Page - Landing Page
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useCustomHooks';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { Navigation } from '../components/common/Navigation';

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Mental Health
              <span className="text-blue-600 block">Journey Starts Here</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              MEND provides comprehensive mental health support through evidence-based assessments,
              professional therapy sessions, career guidance, and a supportive community—all in one secure platform.
            </p>

            <div className="flex gap-4 justify-center flex-wrap mb-12">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-semibold text-gray-900">Evidence-Based</div>
                <div className="text-sm text-gray-600">Clinically validated assessments</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl mb-2">🔒</div>
                <div className="font-semibold text-gray-900">HIPAA Compliant</div>
                <div className="text-sm text-gray-600">Your privacy is protected</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="text-3xl mb-2">🌟</div>
                <div className="font-semibold text-gray-900">24/7 Support</div>
                <div className="text-sm text-gray-600">Access help anytime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Serve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our diverse community of individuals seeking mental wellness and professionals dedicated to helping others.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-blue-200 transition-colors">
              <CardBody className="p-8">
                <div className="text-5xl mb-4">👤</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Individuals</h3>
                <p className="text-gray-600 mb-4">
                  Access mental health assessments, therapy sessions, career guidance, and connect with our supportive community.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li>• Self-assessment tools</li>
                  <li>• Progress tracking</li>
                  <li>• Community support</li>
                  <li>• Career resources</li>
                </ul>
              </CardBody>
            </Card>

            <Card className="text-center border-2 hover:border-green-200 transition-colors">
              <CardBody className="p-8">
                <div className="text-5xl mb-4">🩺</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Therapists</h3>
                <p className="text-gray-600 mb-4">
                  Licensed professionals can offer their expertise, manage sessions, and help clients on their healing journey.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li>• Session management</li>
                  <li>• Client progress tracking</li>
                  <li>• Secure communication</li>
                  <li>• Professional network</li>
                </ul>
              </CardBody>
            </Card>

            <Card className="text-center border-2 hover:border-purple-200 transition-colors">
              <CardBody className="p-8">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mentors</h3>
                <p className="text-gray-600 mb-4">
                  Career mentors provide guidance and support to help individuals achieve their professional goals.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li>• Career counseling</li>
                  <li>• Skill development</li>
                  <li>• Goal setting</li>
                  <li>• Professional networking</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Mental Health Platform</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for mental wellness in one integrated platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card hoverable className="h-full">
              <CardBody>
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mental Health Assessments</h3>
                <p className="text-gray-600">
                  Take evidence-based assessments like PHQ-9 and GAD-7 to understand your mental health status and track progress over time.
                </p>
              </CardBody>
            </Card>

            <Card hoverable className="h-full">
              <CardBody>
                <div className="text-4xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Therapy</h3>
                <p className="text-gray-600">
                  Connect with licensed therapists and book personalized therapy sessions at your convenience through our secure platform.
                </p>
              </CardBody>
            </Card>

            <Card hoverable className="h-full">
              <CardBody>
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Creative Community</h3>
                <p className="text-gray-600">
                  Share your stories, express yourself through creative posts, and connect with others in our supportive, moderated community.
                </p>
              </CardBody>
            </Card>

            <Card hoverable className="h-full">
              <CardBody>
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Career Guidance</h3>
                <p className="text-gray-600">
                  Get personalized career recommendations, skill assessments, and guidance from experienced mentors to achieve your goals.
                </p>
              </CardBody>
            </Card>

            <Card hoverable className="h-full">
              <CardBody>
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Analytics</h3>
                <p className="text-gray-600">
                  Monitor your mental health journey with detailed analytics, progress reports, and insights to celebrate your achievements.
                </p>
              </CardBody>
            </Card>

            <Card hoverable className="h-full">
              <CardBody>
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy & Security</h3>
                <p className="text-gray-600">
                  Your data is encrypted, HIPAA-compliant, and secure. We never share your personal information without explicit consent.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Follow these steps to begin your mental health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
              <p className="text-gray-600">Sign up as a user, therapist, or mentor and complete your profile in minutes.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Assess & Connect</h3>
              <p className="text-gray-600">Take assessments, book therapy sessions, or start providing guidance based on your role.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600">Monitor your journey with detailed analytics and celebrate milestones along the way.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">4</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Grow & Thrive</h3>
              <p className="text-gray-600">Achieve your mental health and career goals with ongoing support from our community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600">Real stories from real people improving their lives with MEND.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "MEND helped me understand my anxiety better and connect with an amazing therapist. The assessments are spot-on and the progress tracking keeps me motivated."
              </p>
              <div className="font-semibold text-gray-900">Sarah M.</div>
              <div className="text-sm text-gray-600">User</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "As a therapist, MEND makes it easy to manage sessions and track client progress. The platform is secure and user-friendly."
              </p>
              <div className="font-semibold text-gray-900">Dr. James L.</div>
              <div className="text-sm text-gray-600">Licensed Therapist</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-lg">★★★★★</div>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Mentoring on MEND has been incredibly rewarding. I've helped several individuals find their career path and it's fulfilling to see their growth."
              </p>
              <div className="font-semibold text-gray-900">Maria R.</div>
              <div className="text-sm text-gray-600">Career Mentor</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who have transformed their mental health and career with MEND.
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-50">
              Create Your Free Account
            </Button>
          </Link>
          <p className="text-sm mt-4 opacity-75">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">MEND</div>
              <p className="text-gray-400 text-sm">
                Mental and Emotional Nurturing Digital - Your comprehensive mental health companion.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Assessments</a></li>
                <li><a href="#" className="hover:text-white">Therapy</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Career</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Emergency</a></li>
                <li><a href="#" className="hover:text-white">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 MEND - Mental and Emotional Nurturing Digital. All rights reserved.
            </p>
            <div className="flex justify-center gap-6 mt-4">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">LinkedIn</a>
              <a href="#" >Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
