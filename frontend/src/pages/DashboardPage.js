/**
 * Dashboard Page Component
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useCustomHooks';
import { useFetch } from '../hooks/useCustomHooks';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Alert } from '../components/common/Alert';
import { assessmentService, sessionService, postService } from '../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: latestAssessment } = useFetch(
    () => assessmentService.getStats(),
    []
  );

  const { data: upcomingSessions, loading: sessionsLoading } = useFetch(
    () => sessionService.getMySessions(5, 0),
    []
  );

  const { data: communityPosts } = useFetch(
    () => postService.getAllPosts('creative', 5, 0),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's your mental health journey overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card hoverable>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Assessments</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {latestAssessment?.totalAssessments || 0}
                  </p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </CardBody>
          </Card>

          <Card hoverable>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Therapy Sessions</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {upcomingSessions?.length || 0}
                  </p>
                </div>
                <div className="text-4xl">🧘</div>
              </div>
            </CardBody>
          </Card>

          <Card hoverable>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Community Posts</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {communityPosts?.length || 0}
                  </p>
                </div>
                <div className="text-4xl">📝</div>
              </div>
            </CardBody>
          </Card>

          <Card hoverable>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Mood Streak</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {latestAssessment?.streakDays || 0}d
                  </p>
                </div>
                <div className="text-4xl">🔥</div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Assessments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <Link to="/assessments">
                  <Button variant="primary" fullWidth>
                    📋 Take an Assessment
                  </Button>
                </Link>
                <Link to="/sessions">
                  <Button variant="secondary" fullWidth>
                    🗓️ Book Therapy Session
                  </Button>
                </Link>
                <Link to="/community">
                  <Button variant="outline" fullWidth>
                    ✍️ Share with Community
                  </Button>
                </Link>
                <Link to="/career">
                  <Button variant="success" fullWidth>
                    🚀 Explore Career Path
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>

          {/* Upcoming Sessions */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
              </CardHeader>
              <CardBody>
                {sessionsLoading ? (
                  <Loading message="Loading sessions..." />
                ) : upcomingSessions && upcomingSessions.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                        <p className="font-semibold text-gray-900">{session.therapistName || 'Therapist'}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(session.startTime).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-blue-600 font-medium">
                          {new Date(session.startTime).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert
                    type="info"
                    message="No upcoming sessions scheduled"
                    dismissible={false}
                  />
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Your Progress */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {latestAssessment?.averageScore || 0}%
                </div>
                <p className="text-gray-600 mt-2">Mental Health Score</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {latestAssessment?.completionRate || 0}%
                </div>
                <p className="text-gray-600 mt-2">Completion Rate</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">
                  {latestAssessment?.totalDays || 0}
                </div>
                <p className="text-gray-600 mt-2">Days on MEND</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
