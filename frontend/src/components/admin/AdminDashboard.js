/**
 * Admin Dashboard Component
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '../common/Card';
import { Alert } from '../common/Alert';
import { Loading } from '../common/Loading';
import { Button } from '../common/Button';
import { Logo } from '../common/Logo';
import { adminService, postService } from '../../services/api';

const formatDateTime = (value) => {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleString();
};

const StatCard = ({ label, value, tone = 'blue' }) => {
  const toneClasses = {
    blue: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300',
    emerald: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300',
    violet: 'text-violet-700 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300',
    amber: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300'
  };

  return (
    <div className={`rounded-3xl p-5 ${toneClasses[tone] || toneClasses.blue}`}>
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">{label}</p>
      <p className="mt-3 text-4xl font-black">{value}</p>
    </div>
  );
};

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [assessmentStats, setAssessmentStats] = useState([]);
  const [sessionStats, setSessionStats] = useState([]);
  const [postStats, setPostStats] = useState([]);
  const [engagementMetrics, setEngagementMetrics] = useState([]);
  const [moderationPosts, setModerationPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [moderationFeedback, setModerationFeedback] = useState('');
  const [moderatingPostId, setModeratingPostId] = useState(null);

  const panelClass =
    'border border-white/70 dark:border-slate-800/80 bg-white/88 dark:bg-slate-950/78 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_60px_rgba(2,6,23,0.42)]';
  const softPanelClass =
    'border border-white/60 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/78 backdrop-blur-xl shadow-[0_18px_48px_rgba(15,23,42,0.07)] dark:shadow-[0_18px_48px_rgba(2,6,23,0.36)]';
  const badgeClass =
    'text-xs font-semibold px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/80 border border-white/70 dark:border-slate-700/80 text-slate-600 dark:text-slate-300';

  const loadAdminData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      setError('');

      const [
        dashboardStats,
        usersResponse,
        assessmentResponse,
        sessionResponse,
        postResponse,
        engagementResponse,
        moderationResponse
      ] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllUsers(12, 0),
        adminService.getAssessmentStats(),
        adminService.getSessionStats(),
        adminService.getPostStats(),
        adminService.getEngagementMetrics(),
        postService.getAllPosts('all', 8, 0)
      ]);

      setStats(dashboardStats);
      setUsers(Array.isArray(usersResponse?.users) ? usersResponse.users : Array.isArray(usersResponse) ? usersResponse : []);
      setAssessmentStats(Array.isArray(assessmentResponse) ? assessmentResponse : assessmentResponse?.stats || []);
      setSessionStats(Array.isArray(sessionResponse) ? sessionResponse : sessionResponse?.stats || []);
      setPostStats(Array.isArray(postResponse) ? postResponse : postResponse?.stats || []);
      setEngagementMetrics(Array.isArray(engagementResponse) ? engagementResponse : engagementResponse?.metrics || []);
      setModerationPosts(
        Array.isArray(moderationResponse?.posts)
          ? moderationResponse.posts
          : Array.isArray(moderationResponse)
            ? moderationResponse
            : []
      );
    } catch (err) {
      setError(err.message || 'Unable to load admin workspace.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleModeration = async (postId, action) => {
    try {
      setModerationFeedback('');
      setModeratingPostId(postId);
      await adminService.moderateContent(postId, action);
      setModerationFeedback(`Post ${action}d successfully.`);
      await loadAdminData(true);
    } catch (err) {
      setModerationFeedback(err.message || 'Unable to update post status.');
    } finally {
      setModeratingPostId(null);
    }
  };

  if (loading) return <Loading message="Loading admin workspace..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <div className={`mb-8 rounded-[32px] p-6 md:p-8 ${panelClass}`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-50">Admin Command Center</h1>
            <p className="text-gray-600 dark:text-slate-300 mt-2 max-w-2xl">
              Monitor platform health, review engagement patterns, and keep community operations moving from one workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <span className={badgeClass}>Moderation</span>
            <span className={badgeClass}>Analytics</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => loadAdminData(true)}
              loading={refreshing}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard label="Users" value={stats.users || 0} tone="blue" />
          <StatCard label="Assessments" value={stats.assessments || 0} tone="emerald" />
          <StatCard label="Sessions" value={stats.sessions || 0} tone="violet" />
          <StatCard label="Published Posts" value={stats.posts || 0} tone="amber" />
        </div>
      )}

      <div className={`mb-6 rounded-[28px] px-4 py-3 ${softPanelClass}`}>
        <div className="flex gap-4 flex-wrap">
          {['overview', 'users', 'analytics', 'moderation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize font-semibold rounded-full transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.9fr] gap-6">
          <Card className={softPanelClass}>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Platform Snapshot</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-5">
                  <p className="text-sm text-slate-500 dark:text-slate-300">Last activity</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {formatDateTime(stats?.lastActivityAt)}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-5">
                  <p className="text-sm text-slate-500 dark:text-slate-300">Dashboard refreshed</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {formatDateTime(stats?.timestamp)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-3xl bg-slate-950 text-white p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Assessment Types</p>
                  <p className="mt-3 text-3xl font-black">{assessmentStats.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-950 text-white p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Session Statuses</p>
                  <p className="mt-3 text-3xl font-black">{sessionStats.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-950 text-white p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Active Post Types</p>
                  <p className="mt-3 text-3xl font-black">{postStats.length}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className={softPanelClass}>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Top Engagement</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {engagementMetrics.length === 0 ? (
                <Alert type="info" message="No engagement activity has been recorded yet." dismissible={false} />
              ) : (
                engagementMetrics.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-3xl border border-slate-200 dark:border-slate-700 p-4 bg-white/70 dark:bg-slate-900/70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-50">
                          {`${entry.first_name || ''} ${entry.last_name || ''}`.trim() || entry.email}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-300">{entry.email}</p>
                      </div>
                      <span className={badgeClass}>Score {entry.engagement_score || 0}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>Assessments: {entry.assessment_count || 0}</p>
                      <p>Sessions: {entry.session_count || 0}</p>
                      <p>Posts: {entry.post_count || 0}</p>
                      <p>Comments: {entry.comment_count || 0}</p>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <Card className={softPanelClass}>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Recent Users</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {users.length === 0 ? (
              <Alert type="info" message="No users found yet." dismissible={false} />
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/70"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                        {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed user'}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-300">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <span className={badgeClass}>{user.role || 'user'}</span>
                      <span>Joined {formatDateTime(user.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className={softPanelClass}>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Assessments</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {assessmentStats.length === 0 ? (
                <Alert type="info" message="Assessment analytics will appear here once data is available." dismissible={false} />
              ) : (
                assessmentStats.map((item) => (
                  <div key={item.type} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                    <p className="font-semibold text-slate-900 dark:text-slate-50 uppercase">{item.type}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Total: {item.total || 0}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Average score: {item.avg_score || 0}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Severe cases: {item.severe_count || 0}</p>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          <Card className={softPanelClass}>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Sessions</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {sessionStats.length === 0 ? (
                <Alert type="info" message="Session analytics will appear here once data is available." dismissible={false} />
              ) : (
                sessionStats.map((item) => (
                  <div key={item.status} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                    <p className="font-semibold text-slate-900 dark:text-slate-50 capitalize">{item.status}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Total: {item.total || 0}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Users: {item.unique_users || 0}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Therapists: {item.active_therapists || 0}</p>
                  </div>
                ))
              )}
            </CardBody>
          </Card>

          <Card className={softPanelClass}>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Community Posts</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {postStats.length === 0 ? (
                <Alert type="info" message="Community post analytics will appear here once data is available." dismissible={false} />
              ) : (
                postStats.map((item) => (
                  <div key={item.type} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                    <p className="font-semibold text-slate-900 dark:text-slate-50 capitalize">{item.type}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Posts: {item.total || 0}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Likes: {item.total_likes || 0}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Comments: {item.total_comments || 0}</p>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'moderation' && (
        <Card className={softPanelClass}>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Recent Community Posts</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
              Use this workspace to archive or re-approve recent posts.
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            {moderationFeedback ? (
              <Alert
                type={moderationFeedback.toLowerCase().includes('unable') ? 'error' : 'success'}
                message={moderationFeedback}
                onClose={() => setModerationFeedback('')}
              />
            ) : null}

            {moderationPosts.length === 0 ? (
              <Alert type="info" message="No posts are available for moderation right now." dismissible={false} />
            ) : (
              moderationPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-700 p-5 bg-white/70 dark:bg-slate-900/70"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{post.title}</p>
                        <span className={badgeClass}>{post.type || 'post'}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-300 mt-2">
                        By {`${post.first_name || ''} ${post.last_name || ''}`.trim() || 'User'} on {formatDateTime(post.created_at)}
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 mt-3">{post.content}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleModeration(post.id, 'approve')}
                        loading={moderatingPostId === post.id}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModeration(post.id, 'archive')}
                        loading={moderatingPostId === post.id}
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};
