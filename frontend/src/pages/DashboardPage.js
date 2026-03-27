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
  const [selectedTherapist, setSelectedTherapist] = React.useState('');
  const [bookingStartTime, setBookingStartTime] = React.useState('');
  const [bookingNotes, setBookingNotes] = React.useState('');
  const [isBookingFromDashboard, setIsBookingFromDashboard] = React.useState(false);
  const [dashboardBookingMessage, setDashboardBookingMessage] = React.useState('');

  const isTherapist = user?.role === 'therapist';
  const isMentor = user?.role === 'mentor';

  // Check if user is new (signed up within last 7 days)
  const isNewUser = user?.createdAt ? 
    (new Date() - new Date(user.createdAt)) < (7 * 24 * 60 * 60 * 1000) : false;

  // Fetch dashboard data
  const { data: assessmentStats, refetch: refetchAssessmentStats } = useFetch(
    () => assessmentService.getStats(),
    [user?.id]
  );

  const { data: upcomingSessions, loading: sessionsLoading, refetch: refetchSessions } = useFetch(
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

  const { data: communityPosts, refetch: refetchCommunityPosts } = useFetch(
    () => postService.getAllPosts('all', 20, 0),
    [user?.id]
  );

  const communityPostsData = Array.isArray(communityPosts)
    ? communityPosts
    : communityPosts?.posts || communityPosts?.data?.posts || [];

  const communityPostsCount = Array.isArray(communityPosts)
    ? communityPosts.length
    : communityPosts?.count ?? communityPosts?.data?.count ?? communityPostsData.length;

  const { data: availableTherapists, loading: therapistsLoading } = useFetch(
    () => (!isTherapist && !isMentor ? sessionService.getAvailableTherapists() : Promise.resolve([])),
    [user?.id, isTherapist, isMentor]
  );

  const therapistsData = Array.isArray(availableTherapists)
    ? availableTherapists
    : availableTherapists?.therapists || availableTherapists?.data?.therapists || [];

  React.useEffect(() => {
    const onCommunityUpdated = () => {
      refetchCommunityPosts();
    };

    window.addEventListener('communityUpdated', onCommunityUpdated);
    return () => window.removeEventListener('communityUpdated', onCommunityUpdated);
  }, [refetchCommunityPosts]);

  React.useEffect(() => {
    const onAssessmentUpdated = () => {
      refetchAssessmentStats();
    };

    window.addEventListener('assessmentUpdated', onAssessmentUpdated);
    return () => window.removeEventListener('assessmentUpdated', onAssessmentUpdated);
  }, [refetchAssessmentStats]);

  const handleDashboardBooking = async (e) => {
    e.preventDefault();
    setDashboardBookingMessage('');

    if (!selectedTherapist || !bookingStartTime) {
      setDashboardBookingMessage('Please select a therapist and date/time.');
      return;
    }

    const parsedStart = new Date(bookingStartTime);
    if (Number.isNaN(parsedStart.getTime())) {
      setDashboardBookingMessage('Please select a valid date/time.');
      return;
    }

    setIsBookingFromDashboard(true);
    try {
      const startIso = parsedStart.toISOString();
      const endIso = new Date(parsedStart.getTime() + 60 * 60000).toISOString();
      await sessionService.bookSession(Number(selectedTherapist), startIso, endIso, bookingNotes);
      await refetchSessions();
      setSelectedTherapist('');
      setBookingStartTime('');
      setBookingNotes('');
      setDashboardBookingMessage('Session booked successfully.');
    } catch (err) {
      setDashboardBookingMessage(err.message || 'Failed to book session.');
    } finally {
      setIsBookingFromDashboard(false);
    }
  };

  if (isTherapist) {
    const pendingSessions = sessionsData.filter((s) => s.status === 'pending');
    const completedSessions = sessionsData.filter((s) => s.status === 'completed');

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Therapist Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome, {user?.firstName}. Manage your client sessions and clinical workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardBody>
                <p className="text-gray-600 text-sm">Total Sessions</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{sessionsData.length}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-gray-600 text-sm">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingSessions.length}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-gray-600 text-sm">Completed Sessions</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{completedSessions.length}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-gray-600 text-sm">Community Activity</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{communityPostsCount || 0}</p>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">Upcoming Client Sessions</h2>
                </CardHeader>
                <CardBody>
                  {sessionsLoading ? (
                    <Loading message="Loading therapist sessions..." />
                  ) : sessionsData.length === 0 ? (
                    <Alert type="info" message="No assigned sessions yet." dismissible={false} />
                  ) : (
                    <div className="space-y-3">
                      {sessionsData.map((session) => {
                        const sessionStart = session.start_time || session.startTime;
                        const sessionDate = sessionStart ? new Date(sessionStart) : null;
                        const hasValidDate = sessionDate && !Number.isNaN(sessionDate.getTime());
                        return (
                          <div key={session.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {`${session.first_name || ''} ${session.last_name || ''}`.trim() || 'Client'}
                                </p>
                                <p className="text-sm text-gray-600 capitalize">Status: {session.status}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-700">
                                  {hasValidDate ? sessionDate.toLocaleDateString() : 'Date pending'}
                                </p>
                                <p className="text-sm text-blue-600 font-medium">
                                  {hasValidDate ? sessionDate.toLocaleTimeString() : 'Time pending'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-gray-900">Therapist Actions</h2>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Link to="/sessions">
                    <Button variant="primary" fullWidth>Manage Sessions</Button>
                  </Link>
                  <Link to="/community">
                    <Button variant="outline" fullWidth>Community Support</Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="secondary" fullWidth>Update Therapist Profile</Button>
                  </Link>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                      {communityPostsCount || 0}
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
                      {assessmentStats?.averageScore || 0}%
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
                      {communityPostsCount || 0}
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
                      {assessmentStats?.totalAssessments || 0}
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
                      {communityPostsCount || 0}
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
                      {assessmentStats?.moodStreak || 0}d
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
                      const sessionStart = session.start_time || session.startTime;
                      const sessionDate = sessionStart ? new Date(sessionStart) : null;
                      const hasValidDate = sessionDate && !Number.isNaN(sessionDate.getTime());
                      return (
                        <div key={session.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                          <p className="font-semibold text-gray-900">{partnerName}</p>
                          <p className="text-xs text-gray-500 font-medium">{partnerLabel}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {hasValidDate ? sessionDate.toLocaleDateString() : 'Date pending'}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">
                            {hasValidDate ? sessionDate.toLocaleTimeString() : 'Time pending'}
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

        {!isMentor && (
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Book With a Therapist</h2>
            </CardHeader>
            <CardBody>
              {dashboardBookingMessage ? (
                <Alert
                  type={dashboardBookingMessage.toLowerCase().includes('success') ? 'success' : 'error'}
                  message={dashboardBookingMessage}
                  dismissible
                  onClose={() => setDashboardBookingMessage('')}
                />
              ) : null}

              {therapistsLoading ? (
                <Loading message="Loading therapists..." />
              ) : therapistsData.length === 0 ? (
                <Alert
                  type="info"
                  message="No licensed therapists available at the moment."
                  dismissible={false}
                />
              ) : (
                <form onSubmit={handleDashboardBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Therapist</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedTherapist}
                      onChange={(e) => setSelectedTherapist(e.target.value)}
                      required
                    >
                      <option value="">-- Select therapist --</option>
                      {therapistsData.map((therapist) => (
                        <option key={therapist.id} value={therapist.id}>
                          {therapist.first_name} {therapist.last_name}
                          {therapist.specialization ? ` - ${therapist.specialization}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={bookingStartTime}
                      onChange={(e) => setBookingStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Share what support you need in this session..."
                    />
                  </div>

                  <Button type="submit" variant="success" loading={isBookingFromDashboard}>
                    Book Session
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>
        )}

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
                    {communityPostsCount || 0}
                  </div>
                  <p className="text-gray-600 mt-2">Community Interactions</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    {assessmentStats?.completionRate || 0}%
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
                    {assessmentStats?.averageScore || 0}%
                  </div>
                  <p className="text-gray-600 mt-2">Mental Health Score</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    {assessmentStats?.completionRate || 0}%
                  </div>
                  <p className="text-gray-600 mt-2">Completion Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">
                    {assessmentStats?.totalDays || 0}
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
