/**
 * Dashboard Page Component
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useFetch } from '../hooks/useCustomHooks';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Alert } from '../components/common/Alert';
import { assessmentService, sessionService, postService, careerService } from '../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isTherapist = user?.role === 'therapist';
  const isMentor = user?.role === 'mentor';

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

  const sessionsData = Array.isArray(sessionPayload) ? sessionPayload : sessionPayload?.sessions || [];
  const postsData = Array.isArray(postsPayload)
    ? postsPayload
    : postsPayload?.posts || postsPayload?.data?.posts || [];

  const myPostsCount = postsData.filter((post) => Number(post.user_id) === Number(user?.id)).length;
  const mentorHistoryCount = Array.isArray(careerPayload)
    ? careerPayload.length
    : careerPayload?.history?.length || 0;
  const mentorProgressCount = Array.isArray(mentorProgressPayload)
    ? mentorProgressPayload.length
    : mentorProgressPayload?.progress?.length || 0;
  const mentorResourcesCount = Array.isArray(mentorResourcesPayload)
    ? mentorResourcesPayload.length
    : mentorResourcesPayload?.resources?.length || 0;
  const userCareerPath = !isTherapist && !isMentor ? careerPayload : null;
  const mentorLatestGuidance = Array.isArray(careerPayload)
    ? careerPayload[0]
    : careerPayload?.history?.[0];
  const mentorResources = Array.isArray(mentorResourcesPayload)
    ? mentorResourcesPayload
    : mentorResourcesPayload?.resources || [];
  const mentorProgressItems = Array.isArray(mentorProgressPayload)
    ? mentorProgressPayload
    : mentorProgressPayload?.progress || [];
  const mentorUpcomingSessions = sessionsData.filter((session) => {
    const start = session.start_time || session.startTime;
    if (!start) return false;
    const date = new Date(start);
    return !Number.isNaN(date.getTime()) && date.getTime() >= Date.now();
  });
  const mentorCompletedSessions = sessionsData.filter((session) => session.status === 'completed').length;
  const mentorPendingSessions = sessionsData.filter((session) => session.status === 'pending').length;
  const mentorMenteeNames = new Set(
    sessionsData
      .map((session) => `${session.first_name || ''} ${session.last_name || ''}`.trim())
      .filter(Boolean)
  );
  const mentorActiveMenteesCount = mentorMenteeNames.size;

  React.useEffect(() => {
    if (!isMentor || !location?.hash) return;
    const sectionId = location.hash.replace('#', '');
    const node = document.getElementById(sectionId);
    if (node) {
      window.setTimeout(() => {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }, [isMentor, location.hash]);

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

  if (isTherapist) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Therapist Portal</h1>
            <p className="text-gray-600 mt-2">Therapist dashboard has been removed.</p>
          </div>
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Continue in Therapy</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-gray-600">Please use the Therapy page to manage client sessions and groups.</p>
              <Link to="/sessions">
                <Button variant="primary" fullWidth>Go To Therapy</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (isMentor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Mentor Dashboard</h1>
            <p className="text-gray-600 mt-2">Career guidance, mentorship, and talent development in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card id="mentorship-section" className="border-indigo-200 bg-gradient-to-b from-indigo-50 to-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-indigo-900">Mentorship</h2>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-100 text-indigo-700">1:1 Coaching</span>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <p className="text-sm text-gray-600">Run 1:1 mentorship with clear mentee follow-up and next-step planning.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-indigo-50">
                    <p className="text-xs text-gray-600">Active Mentees</p>
                    <p className="text-2xl font-bold text-indigo-700">{mentorActiveMenteesCount}</p>
                  </div>
                  <div className="p-3 rounded bg-blue-50">
                    <p className="text-xs text-gray-600">Upcoming Sessions</p>
                    <p className="text-2xl font-bold text-blue-700">{mentorUpcomingSessions.length}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-amber-50">
                    <p className="text-xs text-gray-600">Pending Requests</p>
                    <p className="text-xl font-bold text-amber-700">{mentorPendingSessions}</p>
                  </div>
                  <div className="p-3 rounded bg-green-50">
                    <p className="text-xs text-gray-600">Completed Sessions</p>
                    <p className="text-xl font-bold text-green-700">{mentorCompletedSessions}</p>
                  </div>
                </div>
                {mentorUpcomingSessions.length > 0 ? (
                  <p className="text-sm text-indigo-800">
                    Next Mentorship Check-in: <strong>{new Date(mentorUpcomingSessions[0].start_time || mentorUpcomingSessions[0].startTime).toLocaleString()}</strong>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">No upcoming mentorship sessions yet.</p>
                )}
                <Link to="/sessions">
                  <Button variant="primary" fullWidth>Open Mentorship Manager</Button>
                </Link>
              </CardBody>
            </Card>

            <Card id="career-guidance-section" className="border-purple-200 bg-gradient-to-b from-purple-50 to-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-purple-900">Career Guidance</h2>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-100 text-purple-700">Roadmaps</span>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <p className="text-sm text-gray-600">Create and refine career plans, goals, and action roadmaps.</p>
                <div>
                  <p className="text-gray-600 text-sm">Latest Guidance Goal</p>
                  <p className="text-lg font-bold text-purple-600 mt-1">
                    {mentorLatestGuidance?.career_goal || 'No guidance goal saved yet'}
                  </p>
                </div>
                <p className="text-sm text-gray-600">Total Guidance Records: <strong>{mentorHistoryCount}</strong></p>
                <p className="text-sm text-gray-600">Guidance Resources Shared: <strong>{mentorResourcesCount}</strong></p>
                <Link to="/career">
                  <Button variant="secondary" fullWidth>Manage Guidance</Button>
                </Link>
              </CardBody>
            </Card>

            <Card id="talent-development-section" className="border-emerald-200 bg-gradient-to-b from-emerald-50 to-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-emerald-900">Talent Development</h2>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 text-emerald-700">Growth</span>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <p className="text-sm text-gray-600">Develop mentee capabilities through milestones, skills tracking, and growth outcomes.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-green-50">
                    <p className="text-xs text-gray-600">Tracked Milestones</p>
                    <p className="text-2xl font-bold text-green-700">{mentorProgressCount}</p>
                  </div>
                  <div className="p-3 rounded bg-emerald-50">
                    <p className="text-xs text-gray-600">Resource Library</p>
                    <p className="text-2xl font-bold text-emerald-700">{mentorResources.length}</p>
                  </div>
                </div>
                <p className="text-sm text-emerald-800">Development Health Score: <strong>{assessmentStats?.averageScore || 0}%</strong></p>
                {mentorProgressItems.length > 0 ? (
                  <p className="text-sm text-emerald-800">
                    Latest Development Outcome: <strong>{mentorProgressItems[0].milestone || 'Milestone recorded'}</strong>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">No development milestones tracked yet.</p>
                )}
                <Link to="/career">
                  <Button variant="outline" fullWidth>Open Talent Development</Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600 mt-2">Your dashboard with all core actions fully working.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card><CardBody><p className="text-gray-600 text-sm">Total Assessments</p><p className="text-3xl font-bold text-blue-600 mt-2">{assessmentStats?.totalAssessments || 0}</p></CardBody></Card>
          <Card><CardBody><p className="text-gray-600 text-sm">Therapy Sessions</p><p className="text-3xl font-bold text-green-600 mt-2">{sessionsData.length}</p></CardBody></Card>
          <Card><CardBody><p className="text-gray-600 text-sm">My Posts</p><p className="text-3xl font-bold text-purple-600 mt-2">{myPostsCount}</p></CardBody></Card>
          <Card><CardBody><p className="text-gray-600 text-sm">Mood Streak</p><p className="text-3xl font-bold text-orange-600 mt-2">{assessmentStats?.moodStreak || 0}d</p></CardBody></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2></CardHeader>
              <CardBody className="space-y-3">
                <Link to="/assessments"><Button variant="primary" fullWidth>Take an Assessment</Button></Link>
                <Link to="/sessions"><Button variant="secondary" fullWidth>Book Therapy Session</Button></Link>
                <Button variant="outline" fullWidth>Create Post Below</Button>
                <Link to="/career"><Button variant="success" fullWidth>Explore Career Path</Button></Link>
              </CardBody>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader><h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2></CardHeader>
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
                        <div key={session.id} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                          <p className="font-semibold text-gray-900">{`${session.first_name || ''} ${session.last_name || ''}`.trim() || 'Therapist'}</p>
                          <p className="text-sm text-gray-600 mt-1">{sessionDate && !Number.isNaN(sessionDate.getTime()) ? sessionDate.toLocaleDateString() : 'Date pending'}</p>
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

        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Career Path</h2>
          </CardHeader>
          <CardBody>
            {careerLoading ? (
              <Loading message="Loading career path..." />
            ) : careerError ? (
              <Alert type="error" message={careerError} />
            ) : userCareerPath ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-700"><strong>Goal:</strong> {userCareerPath.career_goal || 'Not set'}</p>
                <p className="text-sm text-gray-700"><strong>Current Role:</strong> {userCareerPath.current_role || 'Not set'}</p>
                <p className="text-sm text-gray-700"><strong>Experience:</strong> {userCareerPath.experience || 'Not set'}</p>
                <div className="pt-2">
                  <Link to="/career"><Button variant="secondary">Update Career Path</Button></Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">No saved career path yet.</p>
                <Link to="/career"><Button variant="success">Create Career Path</Button></Link>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="mb-8" id="post-section">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Post to Community</h2>
            <p className="text-sm text-gray-600 mt-1">Posting is available directly on your dashboard once signed in.</p>
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
              <input className="w-full border border-gray-300 rounded p-2" placeholder="Post title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
              <select className="w-full border border-gray-300 rounded p-2" value={postType} onChange={(e) => setPostType(e.target.value)}>
                <option value="story">Story</option>
                <option value="creative">Creative</option>
                <option value="inspiration">Inspiration</option>
                <option value="question">Question</option>
                <option value="art">Art</option>
              </select>
              <textarea className="w-full border border-gray-300 rounded p-2" rows="4" placeholder="Share your thoughts..." value={postContent} onChange={(e) => setPostContent(e.target.value)} />
              <Button type="submit" variant="primary" loading={postSubmitting}>Publish Post</Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
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
                    <div key={post.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                      <p className="font-semibold text-gray-900">{post.title}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        by {`${post.first_name || ''} ${post.last_name || ''}`.trim() || 'User'} - {new Date(post.created_at || post.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{post.content}</p>
                      <div className="flex gap-5 mt-3">
                        <button onClick={() => handleLikePost(post.id)} className="text-sm text-gray-700 hover:text-red-600">? {likes} Likes</button>
                        <button onClick={() => toggleComments(post.id)} className="text-sm text-gray-700 hover:text-blue-600">?? {comments} Comments</button>
                      </div>

                      {expandedPosts.has(post.id) && (
                        <div className="pt-3">
                          {loadedComments.length === 0 ? (
                            <p className="text-sm text-gray-500 mb-2">No comments yet.</p>
                          ) : (
                            <div className="space-y-2 mb-3">
                              {loadedComments.map((comment) => (
                                <div key={comment.id} className="border rounded p-2 bg-white dark:bg-gray-800">
                                  <p className="text-sm text-gray-700">{comment.content}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    by {`${comment.first_name || ''} ${comment.last_name || ''}`.trim() || 'User'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input
                              className="flex-1 border border-gray-300 rounded p-2"
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
