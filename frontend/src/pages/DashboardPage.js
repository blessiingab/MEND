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
import { assessmentService, sessionService, postService, careerService } from '../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();

  const isTherapist = user?.role === 'therapist';
  const isMentor = user?.role === 'mentor';

  // Check if user is new (signed up within last 7 days)
  const isNewUser = user?.createdAt ? 
    (new Date() - new Date(user.createdAt)) < (7 * 24 * 60 * 60 * 1000) : false;

  // Fetch dashboard data
  const { data: latestAssessment } = useFetch(
    () => assessmentService.getStats(),
    [user?.id]
  );

  const { data: upcomingSessions, loading: sessionsLoading } = useFetch(
    () => isTherapist ? sessionService.getTherapistSessions(5, 0) : sessionService.getMySessions(5, 0),
    [user?.id, user?.role]
  );

  const { data: careerHistory, loading: careerLoading } = useFetch(
    () => isMentor ? careerService.getHistory(5, 0) : careerService.getMyPath(),
    [user?.id, user?.role]
  );

  const mentorGuidanceCount = isMentor ? careerHistory?.length || 0 : 0;
  const userCareerProgress = !isMentor ? (careerHistory ? 1 : 0) : 0;

  // Normalize sessions data for compatibility with older API payloads
  const sessionsData = Array.isArray(upcomingSessions) ? upcomingSessions : upcomingSessions?.sessions || [];

  const { data: communityPosts } = useFetch(
    () => postService.getAllPosts('creative', 5, 0),
    [user?.id]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            {user?.role && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                user.role === 'therapist' ? 'bg-blue-100 text-blue-800' :
                user.role === 'mentor' ? 'bg-emerald-100 text-emerald-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-2">Here's your mental health journey overview</p>
        </div>

        {/* New User Welcome Content */}
        {isNewUser && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                🎉 Welcome to MEND! Your journey starts here.
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Take Your First Assessment</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Start by taking a mental health assessment to understand your current state.
                  </p>
                  <Link to="/assessments">
                    <Button variant="primary" size="sm">Start Assessment</Button>
                  </Link>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🧘</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Book a Therapy Session</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Connect with a licensed therapist for personalized support.
                  </p>
                  <Link to="/sessions">
                    <Button variant="secondary" size="sm">Book Session</Button>
                  </Link>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">👥</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Join the Community</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Share your story and connect with others on similar journeys.
                  </p>
                  <Link to="/community">
                    <Button variant="outline" size="sm">Explore Community</Button>
                  </Link>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Explore Career Guidance</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Get personalized career advice and resources.
                  </p>
                  <Link to="/career">
                    <Button variant="success" size="sm">View Career Path</Button>
                  </Link>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-2">💡 Quick Tips for Getting Started:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete your profile to get personalized recommendations</li>
                  <li>• Set daily mental health goals in your profile settings</li>
                  <li>• Track your mood daily to see patterns over time</li>
                  <li>• Join support groups for additional community support</li>
                </ul>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Quick Stats */}
        {isTherapist ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card hoverable>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Your Appointments</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {sessionsData.length}
                    </p>
                  </div>
                  <div className="text-4xl">🗓️</div>
                </div>
              </CardBody>
            </Card>
            <Card hoverable>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending Requests</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {sessionsData.filter((s) => s.status === 'pending').length}
                    </p>
                  </div>
                  <div className="text-4xl">⏳</div>
                </div>
              </CardBody>
            </Card>
            <Card hoverable>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {sessionsData.filter((s) => s.status === 'completed').length}
                    </p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </CardBody>
            </Card>
            <Card hoverable>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Clients This Week</p>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">
                      {sessionsData.length}
                    </p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </CardBody>
            </Card>
          </div>
        ) : isMentor ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card hoverable>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Guidance Sessions</p>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">
                      {careerHistory?.length || 0}
                    </p>
                  </div>
                  <div className="text-4xl">🎓</div>
                </div>
              </CardBody>
            </Card>
            <Card hoverable>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Saved Resources</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                      {communityPosts?.length || 0}
                    </p>
                  </div>
                  <div className="text-4xl">📚</div>
                </div>
              </CardBody>
            </Card>
            <Card hoverable>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Progress Notes</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {latestAssessment?.completionRate || 0}%
                    </p>
                  </div>
                  <div className="text-4xl">📈</div>
                </div>
              </CardBody>
            </Card>
            <Card hoverable>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Community Posts</p>
                    <p className="text-3xl font-bold text-pink-600 mt-2">
                      {communityPosts?.length || 0}
                    </p>
                  </div>
                  <div className="text-4xl">📝</div>
                </div>
              </CardBody>
            </Card>
          </div>
        ) : (
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
                      {sessionsData.length}
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
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Assessments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isTherapist ? 'Therapist Quick Actions' : isMentor ? 'Mentor Quick Actions' : 'Quick Actions'}
                </h2>
              </CardHeader>
              <CardBody className="space-y-3">
                {isTherapist ? (
                  <>
                    <Link to="/sessions">
                      <Button variant="primary" fullWidth>
                        👥 Manage My Sessions
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button variant="secondary" fullWidth>
                        📁 View Clients
                      </Button>
                    </Link>
                    <Link to="/community">
                      <Button variant="outline" fullWidth>
                        💬 Community Requests
                      </Button>
                    </Link>
                  </>
                ) : isMentor ? (
                  <>
                    <Link to="/career">
                      <Button variant="primary" fullWidth>
                        🎓 Mentor Guidance
                      </Button>
                    </Link>
                    <Link to="/career">
                      <Button variant="secondary" fullWidth>
                        📚 Manage Career Resources
                      </Button>
                    </Link>
                    <Link to="/community">
                      <Button variant="outline" fullWidth>
                        🗣️ Engage Community
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Upcoming Sessions */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">{isTherapist ? 'Assigned Sessions' : isMentor ? 'Mentor Activities' : 'Upcoming Sessions'}</h2>
              </CardHeader>
              <CardBody>
                {sessionsLoading ? (
                  <Loading message="Loading sessions..." />
                ) : sessionsData.length > 0 ? (
                  <div className="space-y-3">
                    {sessionsData.map((session) => {
                      const partnerName = `${session.first_name || session.therapistName || ''} ${session.last_name || ''}`.trim() || (isTherapist ? 'Client' : 'Therapist');
                      const partnerLabel = isTherapist ? 'Client' : 'Therapist';
                      return (
                        <div key={session.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                          <p className="font-semibold text-gray-900">{partnerName}</p>
                          <p className="text-xs text-gray-500 font-medium">{partnerLabel}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(session.startTime).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">
                            {new Date(session.startTime).toLocaleTimeString()}
                          </p>
                        </div>
                      );
                    })}
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

        {isTherapist && (
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Therapist Overview</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {sessionsData.length}
                  </div>
                  <p className="text-gray-600 mt-2">Active Sessions</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    {sessionsData.filter((s) => s.status === 'completed').length}
                  </div>
                  <p className="text-gray-600 mt-2">Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600">
                    {sessionsData.filter((s) => s.status === 'pending').length}
                  </div>                  <p className="text-gray-600 mt-2">Pending</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {isMentor && (
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Mentor Overview</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">
                    {mentorGuidanceCount}
                  </div>
                  <p className="text-gray-600 mt-2">Guidance Sessions</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">
                    {communityPosts?.length || 0}
                  </div>
                  <p className="text-gray-600 mt-2">Community Interactions</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    {latestAssessment?.completionRate || 0}%
                  </div>
                  <p className="text-gray-600 mt-2">Goal Completion</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {!isTherapist && !isMentor && (
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
        )}
      </div>
    </div>
  );
};
