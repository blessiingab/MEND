/**
 * Home Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useCustomHooks';
import { Card, Button } from '../components/common/CommonComponents';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to MEND
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Mental and Emotional Nurturing Digital Platform
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Your comprehensive companion for mental health support, self-assessment, therapy booking, 
            and career guidance all in one place.
          </p>

          {!user && (
            <div className="flex gap-4 justify-center">
              <Link to="/register">
                <Button variant="success" size="lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          <Card>
            <h3 className="text-xl font-bold mb-3">🧠 Mental Health Assessment</h3>
            <p className="text-gray-600">
              Take scientifically-validated assessments (PHQ-9, GAD-7) to understand your mental health better.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-3">👨‍⚕️ Therapy Sessions</h3>
            <p className="text-gray-600">
              Book one-on-one sessions with professional therapists at your convenience.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-3">🎨 Creative Community</h3>
            <p className="text-gray-600">
              Share your stories and artwork, connect with others, and build a supportive community.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-3">💼 Career Guidance</h3>
            <p className="text-gray-600">
              Get personalized career guidance, access resources, and track your professional growth.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-3">🤝 Peer Support</h3>
            <p className="text-gray-600">
              Engage with others, share comments, and build meaningful connections.
            </p>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-3">📊 Analytics</h3>
            <p className="text-gray-600">
              Track your progress over time with detailed statistics and insights.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
