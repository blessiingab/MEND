/**
 * Dashboard Page Component
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useFetch } from '../hooks/useCustomHooks';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Alert } from '../components/common/Alert';
import { Logo } from '../components/common/Logo';
import { assessmentService, sessionService, postService, careerService } from '../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const isTherapist = user?.role === 'therapist';
  const isMentor = user?.role === 'mentor';
  const pageShellClass =
    'min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/70';
  const panelClass =
    'border border-white/70 dark:border-slate-800/80 bg-white/88 dark:bg-slate-950/78 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_60px_rgba(2,6,23,0.42)]';
  const softPanelClass =
    'border border-white/60 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/78 backdrop-blur-xl shadow-[0_18px_48px_rgba(15,23,42,0.07)] dark:shadow-[0_18px_48px_rgba(2,6,23,0.36)]';
  const badgeClass =
    'text-xs font-semibold px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/80 border border-white/70 dark:border-slate-700/80 text-slate-600 dark:text-slate-300';

  const [postTitle, setPostTitle] = React.useState('');
  const [postContent, setPostContent] = React.useState('');
  const [postType, setPostType] = React.useState('story');
  const [postSubmitting, setPostSubmitting] = React.useState(false);
  const [postMessage, setPostMessage] = React.useState('');
  const [expandedPosts, setExpandedPosts] = React.useState(new Set());
  const [commentsByPost, setCommentsByPost] = React.useState({});
  const [commentTextByPost, setCommentTextByPost] = React.useState({});

  const { data: assessmentStats, refetch: refetchAssessmentStats } = useFetch(
    () => assessmentService.getStats(),
    [user?.id]
  );

  const {
    data: sessionPayload,
    loading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions
  } = useFetch(
    () => (isTherapist ? sessionService.getTherapistSessions(20, 0) : sessionService.getMySessions(20, 0)),
    [user?.id, user?.role]
  );

  const {
    data: careerPayload,
    loading: careerLoading,
    error: careerError
  } = useFetch(
    () => (isMentor ? careerService.getHistory(20, 0) : careerService.getMyPath()),
    [user?.id, user?.role]
  );

  const {
    data: postsPayload,
    error: postsError,
    refetch: refetchPosts
  } = useFetch(() => postService.getAllPosts('all', 50, 0), [user?.id]);

  const { data: mentorProgressPayload } = useFetch(
    () => (isMentor ? careerService.getProgressTracking() : Promise.resolve([])),
    [user?.id, user?.role]
  );

  const { data: mentorResourcesPayload } = useFetch(
    () => (isMentor ? careerService.getResources(undefined, 100, 0) : Promise.resolve([])),
    [user?.id, user?.role]
  );

  const { data: therapistGroupsPayload } = useFetch(
    () => (isTherapist ? sessionService.getTherapistGroups() : Promise.resolve([])),
    [user?.id, user?.role]
  );

  const { data: therapistClientsPayload } = useFetch(
    () => (isTherapist ? sessionService.getTherapistClients() : Promise.resolve([])),
    [user?.id, user?.role]
  );

  const sessionsData = Array.isArray(sessionPayload) ? sessionPayload : sessionPayload?.sessions || [];
  const postsData = Array.isArray(postsPayload)
    ? postsPayload
    : postsPayload?.posts || postsPayload?.data?.posts || [];

  const myPostsCount = postsData.filter((post) => Number(post.user_id) === Number(user?.id)).length;
  const mentorProgressCount = Array.isArray(mentorProgressPayload)
    ? mentorProgressPayload.length
    : mentorProgressPayload?.progress?.length || 0;
  const userCareerPath = !isTherapist && !isMentor ? careerPayload : null;
  const mentorResources = Array.isArray(mentorResourcesPayload)
    ? mentorResourcesPayload
    : mentorResourcesPayload?.resources || [];
  const mentorProgressItems = Array.isArray(mentorProgressPayload)
    ? mentorProgressPayload
    : mentorProgressPayload?.progress || [];
  const therapistGroups = Array.isArray(therapistGroupsPayload)
    ? therapistGroupsPayload
    : therapistGroupsPayload?.groups || [];
  const therapistClients = Array.isArray(therapistClientsPayload)
    ? therapistClientsPayload
    : therapistClientsPayload?.clients || [];
  const therapistUpcomingSessions = sessionsData
    .filter((session) => {
      const start = session.start_time || session.startTime;
      if (!start) return false;
      const date = new Date(start);
      return !Number.isNaN(date.getTime()) && date.getTime() >= Date.now();
    })
    .sort((a, b) => new Date(a.start_time || a.startTime) - new Date(b.start_time || b.startTime));
  const therapistCompletedSessions = sessionsData.filter((session) => session.status === 'completed').length;
  const therapistPendingSessions = sessionsData.filter((session) => session.status === 'pending').length;
  const therapistUpcomingCount = therapistUpcomingSessions.length;
  const therapistGroupMembers = therapistGroups.reduce(
    (sum, group) => sum + (Array.isArray(group.members) ? group.members.length : 0),
    0
  );
  const therapistCareFocusLabels = therapistGroups
    .map((group) => group.care_focus)
    .filter(Boolean)
    .slice(0, 3);

  React.useEffect(() => {
    const onCommunityUpdated = () => refetchPosts();
    const onAssessmentUpdated = () => refetchAssessmentStats();

    window.addEventListener('communityUpdated', onCommunityUpdated);
    window.addEventListener('assessmentUpdated', onAssessmentUpdated);

    return () => {
      window.removeEventListener('communityUpdated', onCommunityUpdated);
      window.removeEventListener('assessmentUpdated', onAssessmentUpdated);
    };
  }, [refetchPosts, refetchAssessmentStats]);

  const handleDashboardPostSubmit = async (e) => {
    e.preventDefault();
    setPostMessage('');

    if (!postTitle.trim() || !postContent.trim()) {
      setPostMessage('Please enter both title and content.');
      return;
    }

    setPostSubmitting(true);
    try {
      await postService.createPost(postTitle.trim(), postContent.trim(), postType);
      setPostTitle('');
      setPostContent('');
      setPostType('story');
      setPostMessage('Post published successfully.');
      await Promise.all([refetchPosts(), refetchSessions()]);
      window.dispatchEvent(new Event('communityUpdated'));
    } catch (err) {
      setPostMessage(err.message || 'Failed to publish post.');
    } finally {
      setPostSubmitting(false);
    }
  };

  const fetchComments = async (postId) => {
    const response = await postService.getPostComments(postId, 200, 0);
    const comments = Array.isArray(response) ? response : response?.comments || [];
    setCommentsByPost((prev) => ({ ...prev, [postId]: comments }));
  };

  const toggleComments = async (postId) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
    await fetchComments(postId);
  };

  const handleCommentChange = (postId, value) => {
    setCommentTextByPost((prev) => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId) => {
    const content = (commentTextByPost[postId] || '').trim();
    if (!content) return;

    try {
      await postService.createComment(postId, content);
      setCommentTextByPost((prev) => ({ ...prev, [postId]: '' }));
      await Promise.all([fetchComments(postId), refetchPosts()]);
      window.dispatchEvent(new Event('communityUpdated'));
    } catch (err) {
      setPostMessage(err.message || 'Failed to add comment.');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const likeResult = await postService.likePost(postId);
      if (likeResult?.liked === false) {
        await postService.unlikePost(postId);
      }
      await refetchPosts();
      window.dispatchEvent(new Event('communityUpdated'));
    } catch (err) {
      setPostMessage(err.message || 'Failed to update like.');
    }
  };

  const scrollToPostComposer = () => {
    document.getElementById('post-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isTherapist) {
    return (
      <div className={pageShellClass}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className={`mb-8 rounded-[32px] p-6 md:p-8 ${panelClass}`}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="mb-4">
                  <Logo size="sm" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-50">Therapy Dashboard</h1>
                <p className="text-gray-600 dark:text-slate-300 mt-2 max-w-2xl">
                  A focused workspace for client care, session planning, and therapy coordination.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className={badgeClass}>Clinical Workspace</span>
                <span className={badgeClass}>Client Care</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className={`lg:col-span-2 border-0 overflow-hidden ${panelClass}`}>
              <CardBody className="p-0">
                <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-teal-700 px-6 py-7 text-white">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-100">Clinical Overview</p>
                      <h2 className="text-3xl font-black mt-2">Support your clients with calm, visible structure.</h2>
                      <p className="text-sm text-cyan-100 mt-3 max-w-2xl">
                        Stay on top of upcoming sessions, care groups, and client momentum from one presentable therapy workspace.
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 border border-white/20">
                      Therapist Workspace
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-wide text-cyan-100 font-semibold">Total Sessions</p>
                      <p className="text-3xl font-black mt-2">{sessionsData.length}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-wide text-cyan-100 font-semibold">Upcoming</p>
                      <p className="text-3xl font-black mt-2">{therapistUpcomingCount}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-wide text-cyan-100 font-semibold">Active Clients</p>
                      <p className="text-3xl font-black mt-2">{therapistClients.length}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-wide text-cyan-100 font-semibold">Client Groups</p>
                      <p className="text-3xl font-black mt-2">{therapistGroups.length}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className={softPanelClass}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Practice Pulse</h2>
                    <span className={badgeClass}>Today</span>
                </div>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 px-4 py-3">
                  <p className="text-xs text-gray-600 dark:text-slate-300">Pending Sessions</p>
                  <p className="text-2xl font-bold text-blue-700">{therapistPendingSessions}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3">
                  <p className="text-xs text-gray-600 dark:text-slate-300">Completed Sessions</p>
                  <p className="text-2xl font-bold text-emerald-700">{therapistCompletedSessions}</p>
                </div>
                <div className="rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 px-4 py-3">
                  <p className="text-xs text-gray-600 dark:text-slate-300">Group Memberships</p>
                  <p className="text-2xl font-bold text-cyan-700">{therapistGroupMembers}</p>
                </div>
                <Link to="/sessions">
                  <Button variant="primary" fullWidth>Open Therapy Workspace</Button>
                </Link>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className={`lg:col-span-7 ${softPanelClass}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Upcoming Schedule</h2>
                    <span className={badgeClass}>Sessions</span>
                </div>
              </CardHeader>
              <CardBody>
                {sessionsLoading ? (
                  <Loading message="Loading therapist schedule..." />
                ) : sessionsError ? (
                  <Alert type="error" message={sessionsError} />
                ) : therapistUpcomingSessions.length === 0 ? (
                  <Alert type="info" message="No upcoming therapy sessions yet." dismissible={false} />
                ) : (
                  <div className="space-y-4">
                    {therapistUpcomingSessions.slice(0, 5).map((session) => {
                      const start = session.start_time || session.startTime;
                      const sessionDate = start ? new Date(start) : null;
                      const displayName = `${session.first_name || ''} ${session.last_name || ''}`.trim() || 'Client';
                      return (
                        <div key={session.id} className="rounded-2xl border border-indigo-100 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 px-4 py-4 shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-slate-50">{displayName}</p>
                              <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                                {sessionDate && !Number.isNaN(sessionDate.getTime())
                                  ? sessionDate.toLocaleString()
                                  : 'Session time pending'}
                              </p>
                              <p className="text-xs uppercase tracking-wide text-indigo-600 mt-2">
                                Status: {session.status || 'pending'}
                              </p>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-slate-300 md:text-right">
                              <p>{session.notes ? `Notes: ${session.notes}` : 'No session notes yet.'}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardBody>
            </Card>

            <div className="lg:col-span-5 space-y-6">
              <Card className={softPanelClass}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Client Network</h2>
                    <span className={badgeClass}>Care</span>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-slate-300">Monitor your current client load and how your care groups are distributed.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-green-50 dark:bg-green-950/40">
                      <p className="text-xs text-gray-600 dark:text-slate-300">Active Clients</p>
                      <p className="text-2xl font-bold text-green-700">{therapistClients.length}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
                      <p className="text-xs text-gray-600 dark:text-slate-300">Care Groups</p>
                      <p className="text-2xl font-bold text-emerald-700">{therapistGroups.length}</p>
                    </div>
                  </div>
                  {therapistCareFocusLabels.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {therapistCareFocusLabels.map((focus, index) => (
                        <span key={`${focus}-${index}`} className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                          {focus}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-slate-300">No care focus labels added to groups yet.</p>
                  )}
                  <Link to="/sessions">
                    <Button variant="outline" fullWidth>Manage Clients and Groups</Button>
                  </Link>
                </CardBody>
              </Card>

              <Card className="border border-slate-800 bg-slate-900/95 text-white shadow-[0_20px_60px_rgba(2,6,23,0.42)]">
                <CardHeader>
                  <h2 className="text-2xl font-bold">Care Priorities</h2>
                </CardHeader>
                <CardBody className="space-y-3 text-sm text-slate-200">
                  <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <p className="font-semibold text-white">Session follow-up</p>
                    <p className="mt-1">Review pending sessions and add notes to keep care continuity strong.</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <p className="font-semibold text-white">Group coordination</p>
                    <p className="mt-1">Use therapy groups to support clients with shared needs and care focus areas.</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <p className="font-semibold text-white">Clinical rhythm</p>
                    <p className="mt-1">Keep your schedule balanced with visible upcoming, pending, and completed work.</p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isMentor) {
    return (
      <div className={pageShellClass}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className={`mb-8 rounded-[32px] p-6 md:p-8 ${panelClass}`}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="mb-4">
                  <Logo size="sm" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-50">Mentor Dashboard</h1>
                <p className="text-gray-600 dark:text-slate-300 mt-2 max-w-2xl">
                  Use dedicated mentor workspaces for career guidance and talent development.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className={badgeClass}>Guidance</span>
                <span className={badgeClass}>Talent Growth</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={softPanelClass}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Career Guidance Workspace</h2>
                  <span className={badgeClass}>Separate Feature</span>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  Career guidance now lives in its own dedicated page so mentors can manage roadmaps, guidance records, and planning without mixing it into the dashboard.
                </p>
                <Link to="/career">
                  <Button variant="secondary" fullWidth>Open Career Guidance Workspace</Button>
                </Link>
              </CardBody>
            </Card>

            <Card id="talent-development-section" className={softPanelClass}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Talent Development</h2>
                  <span className={badgeClass}>Growth</span>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-slate-300">Develop mentee capabilities through milestones, skills tracking, and growth outcomes.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-green-50 dark:bg-green-950/40">
                    <p className="text-xs text-gray-600 dark:text-slate-300">Tracked Milestones</p>
                    <p className="text-2xl font-bold text-green-700">{mentorProgressCount}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
                    <p className="text-xs text-gray-600 dark:text-slate-300">Resource Library</p>
                    <p className="text-2xl font-bold text-emerald-700">{mentorResources.length}</p>
                  </div>
                </div>
                <p className="text-sm text-emerald-800 dark:text-emerald-300">Development Health Score: <strong>{assessmentStats?.averageScore || 0}%</strong></p>
                {mentorProgressItems.length > 0 ? (
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    Latest Development Outcome: <strong>{mentorProgressItems[0].milestone || 'Milestone recorded'}</strong>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-slate-300">No development milestones tracked yet.</p>
                )}
                <Link to="/talent-development">
                  <Button variant="outline" fullWidth>Open Talent Development Feature</Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageShellClass}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={`mb-8 rounded-[32px] p-6 md:p-8 ${panelClass}`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="mb-4">
                <Logo size="sm" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-50">Welcome back, {user?.firstName}!</h1>
              <p className="text-gray-600 dark:text-slate-300 mt-2">Your dashboard with all core actions fully working.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className={badgeClass}>Wellness Progress</span>
              <span className={badgeClass}>Daily View</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={softPanelClass}><CardBody><p className="text-gray-600 dark:text-slate-300 text-sm">Total Assessments</p><p className="text-3xl font-bold text-blue-600 mt-2">{assessmentStats?.totalAssessments || 0}</p></CardBody></Card>
          <Card className={softPanelClass}><CardBody><p className="text-gray-600 dark:text-slate-300 text-sm">Therapy Sessions</p><p className="text-3xl font-bold text-green-600 mt-2">{sessionsData.length}</p></CardBody></Card>
          <Card className={softPanelClass}><CardBody><p className="text-gray-600 dark:text-slate-300 text-sm">My Posts</p><p className="text-3xl font-bold text-purple-600 mt-2">{myPostsCount}</p></CardBody></Card>
          <Card className={softPanelClass}><CardBody><p className="text-gray-600 dark:text-slate-300 text-sm">Mood Streak</p><p className="text-3xl font-bold text-orange-600 mt-2">{assessmentStats?.moodStreak || 0}d</p></CardBody></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className={softPanelClass}>
              <CardHeader><h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Quick Actions</h2></CardHeader>
              <CardBody className="space-y-3">
                <Link to="/assessments"><Button variant="primary" fullWidth>Take an Assessment</Button></Link>
                <Link to="/sessions"><Button variant="secondary" fullWidth>Book Therapy Session</Button></Link>
                <Button variant="outline" fullWidth onClick={scrollToPostComposer}>Create Post Below</Button>
                <Link to="/career"><Button variant="success" fullWidth>Explore Career Path</Button></Link>
              </CardBody>
            </Card>
          </div>

          <div>
            <Card className={softPanelClass}>
              <CardHeader><h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">Upcoming Sessions</h2></CardHeader>
              <CardBody>
                {sessionsLoading ? (
                  <Loading message="Loading sessions..." />
                ) : sessionsError ? (
                  <Alert type="error" message={sessionsError} />
                ) : sessionsData.length > 0 ? (
                  <div className="space-y-3">
                    {sessionsData.slice(0, 5).map((session) => {
                      const sessionStart = session.start_time || session.startTime;
                      const sessionDate = sessionStart ? new Date(sessionStart) : null;
                      return (
                        <div key={session.id} className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border-l-4 border-blue-600">
                          <p className="font-semibold text-gray-900 dark:text-slate-50">{`${session.first_name || ''} ${session.last_name || ''}`.trim() || 'Therapist'}</p>
                          <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">{sessionDate && !Number.isNaN(sessionDate.getTime()) ? sessionDate.toLocaleDateString() : 'Date pending'}</p>
                          <p className="text-sm text-blue-600 font-medium">{sessionDate && !Number.isNaN(sessionDate.getTime()) ? sessionDate.toLocaleTimeString() : 'Time pending'}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Alert type="info" message="No upcoming sessions scheduled" dismissible={false} />
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        <Card className={`mb-8 ${softPanelClass}`}>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Career Path</h2>
          </CardHeader>
          <CardBody>
            {careerLoading ? (
              <Loading message="Loading career path..." />
            ) : careerError ? (
              <Alert type="error" message={careerError} />
            ) : userCareerPath ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-slate-200"><strong>Goal:</strong> {userCareerPath.career_goal || 'Not set'}</p>
                <p className="text-sm text-gray-700 dark:text-slate-200"><strong>Current Role:</strong> {userCareerPath.current_role || 'Not set'}</p>
                <p className="text-sm text-gray-700 dark:text-slate-200"><strong>Experience:</strong> {userCareerPath.experience || 'Not set'}</p>
                <div className="pt-2">
                  <Link to="/career"><Button variant="secondary">Update Career Path</Button></Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-slate-300">No saved career path yet.</p>
                <Link to="/career"><Button variant="success">Create Career Path</Button></Link>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className={`mb-8 ${softPanelClass}`} id="post-section">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Post to Community</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">Posting is available directly on your dashboard once signed in.</p>
          </CardHeader>
          <CardBody>
            {postMessage ? (
              <Alert
                type={postMessage.toLowerCase().includes('success') ? 'success' : 'error'}
                message={postMessage}
                dismissible
                onClose={() => setPostMessage('')}
              />
            ) : null}

            <form onSubmit={handleDashboardPostSubmit} className="space-y-3">
              <input className="w-full border border-gray-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 rounded-2xl p-3" placeholder="Post title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
              <select className="w-full border border-gray-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 rounded-2xl p-3" value={postType} onChange={(e) => setPostType(e.target.value)}>
                <option value="story">Story</option>
                <option value="creative">Creative</option>
                <option value="inspiration">Inspiration</option>
                <option value="question">Question</option>
                <option value="art">Art</option>
              </select>
              <textarea className="w-full border border-gray-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 rounded-2xl p-3" rows="4" placeholder="Share your thoughts..." value={postContent} onChange={(e) => setPostContent(e.target.value)} />
              <Button type="submit" variant="primary" loading={postSubmitting}>Publish Post</Button>
            </form>
          </CardBody>
        </Card>

        <Card className={softPanelClass}>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Recent Posts</h2>
          </CardHeader>
          <CardBody>
            {postsError ? (
              <Alert type="error" message={postsError} />
            ) : postsData.length === 0 ? (
              <Alert type="info" message="No posts yet. Create your first post above." dismissible={false} />
            ) : (
              <div className="space-y-3">
                {postsData.slice(0, 10).map((post) => {
                  const likes = Number(post.likes ?? post.likes_count ?? 0);
                  const loadedComments = commentsByPost[post.id] || [];
                  const backendComments = Number(post.comments_count ?? post.comment_count ?? 0);
                  const comments = Math.max(backendComments, loadedComments.length);
                  return (
                    <div key={post.id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-2xl bg-gray-50/90 dark:bg-slate-900/80">
                      <p className="font-semibold text-gray-900 dark:text-slate-50">{post.title}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                        by {`${post.first_name || ''} ${post.last_name || ''}`.trim() || 'User'} - {new Date(post.created_at || post.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-slate-200 mt-2">{post.content}</p>
                      <div className="flex gap-5 mt-3">
                        <button onClick={() => handleLikePost(post.id)} className="text-sm text-gray-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400">Like {likes}</button>
                        <button onClick={() => toggleComments(post.id)} className="text-sm text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400">Comments {comments}</button>
                      </div>

                      {expandedPosts.has(post.id) && (
                        <div className="pt-3">
                          {loadedComments.length === 0 ? (
                            <p className="text-sm text-gray-500 mb-2">No comments yet.</p>
                          ) : (
                            <div className="space-y-2 mb-3">
                              {loadedComments.map((comment) => (
                                <div key={comment.id} className="border border-gray-200 dark:border-slate-700 rounded-2xl p-3 bg-white dark:bg-slate-900">
                                  <p className="text-sm text-gray-700 dark:text-slate-200">{comment.content}</p>
                                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                    by {`${comment.first_name || ''} ${comment.last_name || ''}`.trim() || 'User'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input
                              className="flex-1 border border-gray-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 rounded-2xl p-3"
                              placeholder="Write a comment..."
                              value={commentTextByPost[post.id] || ''}
                              onChange={(e) => handleCommentChange(post.id, e.target.value)}
                            />
                            <Button size="sm" onClick={() => submitComment(post.id)}>Post</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
