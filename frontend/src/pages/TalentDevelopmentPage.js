/**
 * Talent Development Page
 */
import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  FaArrowTrendUp,
  FaBookOpen,
  FaBullseye,
  FaDiagramProject,
  FaFlagCheckered,
  FaPeopleGroup
} from 'react-icons/fa6';
import { useAuth, useFetch } from '../hooks/useCustomHooks';
import { careerService } from '../services/api';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading, Badge } from '../components/common/Loading';
import { Alert } from '../components/common/Alert';

const DEVELOPMENT_PILLARS = [
  {
    title: 'Skill Growth',
    description: 'Track practical capability building through measurable milestones and repeatable practice.'
  },
  {
    title: 'Career Readiness',
    description: 'Connect progress updates to role goals, next-step actions, and long-term guidance plans.'
  },
  {
    title: 'Resource Support',
    description: 'Keep high-value learning materials in view so mentoring stays actionable.'
  }
];

export const TalentDevelopmentPage = () => {
  const { user } = useAuth();
  const [goal, setGoal] = useState('');
  const [milestone, setMilestone] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const {
    data: progressPayload,
    loading: progressLoading,
    error: progressError,
    refetch: refetchProgress
  } = useFetch(() => careerService.getProgressTracking(), [user?.id]);

  const {
    data: resourcesPayload,
    loading: resourcesLoading,
    error: resourcesError
  } = useFetch(() => careerService.getResources(undefined, 100, 0), [user?.id]);

  const {
    data: historyPayload,
    loading: historyLoading,
    error: historyError
  } = useFetch(() => careerService.getHistory(20, 0), [user?.id]);

  const progressItems = useMemo(
    () => (Array.isArray(progressPayload) ? progressPayload : progressPayload?.progress || []),
    [progressPayload]
  );

  const resources = useMemo(
    () => (Array.isArray(resourcesPayload) ? resourcesPayload : resourcesPayload?.resources || []),
    [resourcesPayload]
  );

  const guidanceHistory = useMemo(
    () => (Array.isArray(historyPayload) ? historyPayload : historyPayload?.history || []),
    [historyPayload]
  );

  const latestGuidance = guidanceHistory[0] || null;
  const latestMilestone = progressItems[0] || null;
  const activeGoals = new Set(progressItems.map((item) => item.goal).filter(Boolean)).size;

  const handleSaveMilestone = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!goal.trim() || !milestone.trim()) {
      setMessage('Goal and milestone are required.');
      return;
    }

    setSaving(true);
    try {
      await careerService.trackProgress(goal.trim(), milestone.trim());
      setGoal('');
      setMilestone('');
      await refetchProgress();
      setMessage('Talent development milestone saved.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message || 'Failed to save milestone.');
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'mentor') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="talent-dev-page min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="talent-dev-hero mb-8 overflow-hidden rounded-[2rem] border border-slate-200">
          <div className="talent-dev-orb talent-dev-orb-one"></div>
          <div className="talent-dev-orb talent-dev-orb-two"></div>
          <div className="talent-dev-grid relative z-10 grid grid-cols-1 xl:grid-cols-5 gap-6 p-6 md:p-10">
            <div className="xl:col-span-3 talent-dev-fade-up">
              <Badge variant="success" className="mb-4 talent-dev-badge">New Mentor Feature</Badge>
              <p className="talent-dev-kicker">Development Command Center</p>
              <h1 className="talent-dev-title text-gray-900">Talent Development</h1>
              <p className="text-gray-600 mt-4 max-w-2xl text-base md:text-lg leading-7">
                A dedicated mentor workspace for shaping growth plans, capturing momentum, and turning guidance into visible development outcomes.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="talent-dev-chip">Milestone Intelligence</span>
                <span className="talent-dev-chip">Growth Timeline</span>
                <span className="talent-dev-chip">Guidance Alignment</span>
              </div>
            </div>

            <div className="xl:col-span-2 talent-dev-fade-up talent-dev-delay-2">
              <div className="talent-dev-hero-panel">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Live Snapshot</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">Mentor momentum at a glance</h2>
                  </div>
                  <div className="talent-dev-icon-shell">
                    <FaArrowTrendUp className="text-teal-700" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="talent-dev-metric-card">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Milestones</p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{progressItems.length}</p>
                  </div>
                  <div className="talent-dev-metric-card">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Active Goals</p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{activeGoals}</p>
                  </div>
                </div>
                <div className="talent-dev-highlight mt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latest Outcome</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {latestMilestone?.milestone || 'No milestone recorded yet. Add one to begin the development timeline.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-3 border-0 bg-transparent shadow-none p-0 talent-dev-fade-up talent-dev-delay-1">
            <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="talent-dev-stat-card talent-dev-stat-emerald">
                <div className="flex items-center gap-3 mb-3">
                  <FaFlagCheckered className="text-emerald-700" />
                  <p className="text-sm text-slate-600">Tracked Milestones</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">{progressItems.length}</p>
                <p className="mt-3 text-sm text-slate-600">Concrete development wins captured over time.</p>
              </div>
              <div className="talent-dev-stat-card talent-dev-stat-blue">
                <div className="flex items-center gap-3 mb-3">
                  <FaBullseye className="text-sky-700" />
                  <p className="text-sm text-slate-600">Active Goals</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">{activeGoals}</p>
                <p className="mt-3 text-sm text-slate-600">Distinct goal tracks currently being developed.</p>
              </div>
              <div className="talent-dev-stat-card talent-dev-stat-amber">
                <div className="flex items-center gap-3 mb-3">
                  <FaBookOpen className="text-amber-700" />
                  <p className="text-sm text-slate-600">Resource Library</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">{resources.length}</p>
                <p className="mt-3 text-sm text-slate-600">Support material ready to reinforce mentor action.</p>
              </div>
            </CardBody>
          </Card>

          <Card className="talent-dev-dark-panel talent-dev-fade-up talent-dev-delay-2">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaPeopleGroup />
                Mentor Focus
              </h2>
            </CardHeader>
            <CardBody className="space-y-3 text-sm text-slate-200">
              {DEVELOPMENT_PILLARS.map((pillar, index) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm talent-dev-fade-up"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <p className="font-semibold text-white">{pillar.title}</p>
                  <p className="mt-1 leading-6">{pillar.description}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {(message || progressError) && (
              <Alert
                type={progressError || message.toLowerCase().includes('failed') ? 'error' : 'success'}
                message={progressError || message}
                dismissible
                onClose={() => setMessage('')}
              />
            )}

            <Card className="talent-dev-form-card talent-dev-fade-up talent-dev-delay-1">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaDiagramProject className="text-emerald-600" />
                  Add Development Milestone
                </h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSaveMilestone} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Development Goal *</label>
                    <input
                      className="talent-dev-input w-full rounded-xl p-3"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Example: Prepare mentees for junior product design roles"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Milestone *</label>
                    <textarea
                      className="talent-dev-input w-full rounded-xl p-3"
                      rows="4"
                      value={milestone}
                      onChange={(e) => setMilestone(e.target.value)}
                      placeholder="Example: Completed portfolio review sprint and defined improvement actions"
                    />
                  </div>
                  <Button type="submit" variant="primary" loading={saving} className="talent-dev-cta">
                    Save Milestone
                  </Button>
                </form>
              </CardBody>
            </Card>

            <Card className="talent-dev-timeline-card talent-dev-fade-up talent-dev-delay-2">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaArrowTrendUp className="text-blue-600" />
                  Development Timeline
                </h2>
              </CardHeader>
              <CardBody>
                {progressLoading ? (
                  <Loading message="Loading development milestones..." />
                ) : progressItems.length === 0 ? (
                  <Alert type="info" message="No talent development milestones recorded yet." dismissible={false} />
                ) : (
                  <div className="space-y-4 talent-dev-timeline">
                    {progressItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="talent-dev-timeline-item rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        style={{ animationDelay: `${index * 90}ms` }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-semibold text-gray-900">{item.goal}</p>
                          <Badge variant="success">Milestone</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{item.milestone}</p>
                        <p className="text-xs text-gray-500 mt-3">
                          {new Date(item.created_at || item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="talent-dev-side-card talent-dev-guidance-card talent-dev-fade-up talent-dev-delay-1">
              <CardHeader>
                <h2 className="text-xl font-bold text-purple-900">Latest Guidance Context</h2>
              </CardHeader>
              <CardBody>
                {historyLoading ? (
                  <Loading message="Loading guidance context..." />
                ) : historyError ? (
                  <Alert type="error" message={historyError} />
                ) : latestGuidance ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-purple-700">Goal</p>
                      <p className="font-semibold text-gray-900 mt-1">{latestGuidance.career_goal}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-purple-700">Current Role</p>
                      <p className="text-sm text-gray-700 mt-1">{latestGuidance.current_role || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-purple-700">Guidance Notes</p>
                      <p className="text-sm text-gray-700 mt-1">{latestGuidance.guidance || 'No guidance notes saved yet.'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No guidance record yet. Create one in Career Guidance to anchor development work.</p>
                )}
              </CardBody>
            </Card>

            <Card className="talent-dev-side-card talent-dev-resource-card talent-dev-fade-up talent-dev-delay-2">
              <CardHeader>
                <h2 className="text-xl font-bold text-amber-900">Development Resources</h2>
              </CardHeader>
              <CardBody>
                {resourcesLoading ? (
                  <Loading message="Loading development resources..." />
                ) : resourcesError ? (
                  <Alert type="error" message={resourcesError} />
                ) : resources.length === 0 ? (
                  <p className="text-sm text-gray-600">No resources available yet.</p>
                ) : (
                  <div className="space-y-3">
                    {resources.slice(0, 5).map((resource) => (
                      <div key={resource.id} className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900">{resource.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                          </div>
                          <Badge variant="warning">{resource.type || 'Resource'}</Badge>
                        </div>
                        {resource.link && (
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 text-sm font-medium text-amber-700 hover:underline"
                          >
                            Open resource
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
