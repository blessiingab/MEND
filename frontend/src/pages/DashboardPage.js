/**
 * Dashboard Page
 */
import React from 'react';
import { useAuth } from '../hooks/useCustomHooks';
import { Card, Button } from '../components/common/CommonComponents';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        Welcome back, {user?.firstName}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-xl font-bold mb-4">📋 Assessments</h3>
          <p className="text-gray-600 mb-4">
            Track your mental health with regular assessments
          </p>
          <Link to="/assessments">
            <Button variant="primary" fullWidth>
              Take Assessment
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4">👨‍⚕️ Therapy Sessions</h3>
          <p className="text-gray-600 mb-4">
            Book or view your upcoming therapy sessions
          </p>
          <Link to="/sessions">
            <Button variant="primary" fullWidth>
              Book a Session
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4">🎨 Community</h3>
          <p className="text-gray-600 mb-4">
            Share your stories and connect with others
          </p>
          <Link to="/community">
            <Button variant="primary" fullWidth>
              View Community
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4">💼 Career Path</h3>
          <p className="text-gray-600 mb-4">
            Plan your career and access resources
          </p>
          <Link to="/career">
            <Button variant="primary" fullWidth>
              Explore Career
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4">⚙️ Profile Settings</h3>
          <p className="text-gray-600 mb-4">
            Manage your account and preferences
          </p>
          <Link to="/profile">
            <Button variant="primary" fullWidth>
              Go to Profile
            </Button>
          </Link>
        </Card>

        {user?.role === 'admin' && (
          <Card>
            <h3 className="text-xl font-bold mb-4">🔐 Admin Panel</h3>
            <p className="text-gray-600 mb-4">
              Access admin tools and analytics
            </p>
            <Link to="/admin">
              <Button variant="danger" fullWidth>
                Admin Dashboard
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};
