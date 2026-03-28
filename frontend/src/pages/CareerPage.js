/**
 * Career Guidance Page
 */
import React, { useMemo, useState } from 'react';
import { FaBriefcase, FaCompass, FaBookOpen, FaChartLine, FaBullseye, FaTasks } from 'react-icons/fa';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge, Loading } from '../components/common/Loading';
import { Alert } from '../components/common/Alert';
import { useFetch } from '../hooks/useCustomHooks';
import { careerService } from '../services/api';
import { Logo } from '../components/common/Logo';

const CAREER_PATHS = [
  {
    id: 1,
    title: 'Tech & Software',
    icon: '??',
    roles: ['Software Engineer', 'Data Analyst', 'UI/UX Designer'],
    avgSalary: '$80k-$150k',
    starterGoal: 'Become a mid-level software engineer in 12 months'
  },
  {
    id: 2,
    title: 'Healthcare',
    icon: '??',
    roles: ['Nurse', 'Doctor', 'Therapist'],
    avgSalary: '$60k-$200k',
    starterGoal: 'Transition into a clinical healthcare role'
  },
  {
    id: 3,
    title: 'Business & Finance',
    icon: '??',
    roles: ['Accountant', 'Financial Analyst', 'Business Manager'],
    avgSalary: '$50k-$180k',
    starterGoal: 'Move into an analyst role with stronger financial skills'
  },
  {
    id: 4,
    title: 'Education',
    icon: '??',
    roles: ['Teacher', 'Trainer', 'Counselor'],
    avgSalary: '$40k-$100k',
    starterGoal: 'Build a long-term path in teaching and training'
  },
  {
    id: 5,
    title: 'Creative & Arts',
    icon: '??',
    roles: ['Graphic Designer', 'Copywriter', 'Content Creator'],
    avgSalary: '$35k-$120k',
    starterGoal: 'Build a professional creative portfolio and client base'
  },
  {
    id: 6,
    title: 'Sales & Marketing',
    icon: '??',
    roles: ['Sales Manager', 'Marketing Specialist', 'Brand Manager'],
    avgSalary: '$45k-$150k',
    starterGoal: 'Progress into a strategic marketing role'
  }
];

export const CareerPage = () => {
  const [selectedTab, setSelectedTab] = useState('paths');

  const [careerGoal, setCareerGoal] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [experience, setExperience] = useState('');
  const [guidance, setGuidance] = useState('');
  const [recommendedActionsText, setRecommendedActionsText] = useState('');

  const [trackGoal, setTrackGoal] = useState('');
  const [trackMilestone, setTrackMilestone] = useState('');

  const [guidanceMessage, setGuidanceMessage] = useState('');
  const [progressMessage, setProgressMessage] = useState('');
  const [savingGuidance, setSavingGuidance] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  const {
    data: careerPath,
    loading: careerPathLoading,
    error: careerPathError,
    refetch: refetchCareerPath
  } = useFetch(() => careerService.getMyPath(), []);

  const {
    data: careerHistory,
    loading: historyLoading,
    error: historyError,
    refetch: refetchCareerHistory
  } = useFetch(() => careerService.getHistory(20, 0), []);

  const {
    data: resourcesPayload,
    loading: resourcesLoading,
    error: resourcesError
  } = useFetch(() => careerService.getResources(undefined, 100, 0), []);

  const {
    data: progressPayload,
    loading: progressLoading,
    error: progressError,
    refetch: refetchProgress
  } = useFetch(() => careerService.getProgressTracking(), []);

  const historyList = useMemo(
    () => (Array.isArray(careerHistory) ? careerHistory : careerHistory?.history || []),
    [careerHistory]
  );

  const resources = useMemo(
    () => (Array.isArray(resourcesPayload) ? resourcesPayload : resourcesPayload?.resources || []),
    [resourcesPayload]
  );

  const progressItems = useMemo(
    () => (Array.isArray(progressPayload) ? progressPayload : progressPayload?.progress || []),
    [progressPayload]
  );

  const parseActions = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return String(value)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  React.useEffect(() => {
    if (!careerPath) return;
    setCareerGoal(careerPath.career_goal || '');
    setCurrentRole(careerPath.current_role || '');
    setExperience(careerPath.experience || '');
    setGuidance(careerPath.guidance || '');
    setRecommendedActionsText(parseActions(careerPath.recommended_actions).join(', '));
  }, [careerPath]);

  const applyPathTemplate = (path) => {
    setSelectedTab('guidance');
    setCareerGoal(path.starterGoal);
    setGuidance(`Recommended direction for ${path.title}: focus on core skills, portfolio/projects, networking, and measurable milestones.`);
    setRecommendedActionsText(`Build required skills for ${path.title}, Complete one portfolio project, Connect with 3 professionals in ${path.title}, Apply to targeted roles`);
  };

  const clearGuidanceForm = () => {
    setCareerGoal('');
    setCurrentRole('');
    setExperience('');
    setGuidance('');
    setRecommendedActionsText('');
    setGuidanceMessage('');
  };

  const handleSaveGuidance = async (e) => {
    e.preventDefault();
    setGuidanceMessage('');

    if (!careerGoal.trim() || !currentRole.trim()) {
      setGuidanceMessage('Career goal and current role are required.');
      return;
    }

    setSavingGuidance(true);
    try {
      await careerService.createGuidanceSession(
        careerGoal.trim(),
        currentRole.trim(),
        experience,
        guidance,
        parseActions(recommendedActionsText)
      );
      await Promise.all([refetchCareerPath(), refetchCareerHistory()]);
      setGuidanceMessage('Career guidance saved successfully.');
      setTimeout(() => setGuidanceMessage(''), 3000);
    } catch (err) {
      setGuidanceMessage(err.message || 'Failed to save guidance.');
    } finally {
      setSavingGuidance(false);
    }
  };

  const handleTrackProgress = async (e) => {
    e.preventDefault();
    setProgressMessage('');

    if (!trackGoal.trim() || !trackMilestone.trim()) {
      setProgressMessage('Goal and milestone are required.');
      return;
    }

    setSavingProgress(true);
    try {
      await careerService.trackProgress(trackGoal.trim(), trackMilestone.trim());
      setTrackGoal('');
      setTrackMilestone('');
      await refetchProgress();
      setProgressMessage('Progress milestone saved.');
      setTimeout(() => setProgressMessage(''), 3000);
    } catch (err) {
      setProgressMessage(err.message || 'Failed to save milestone.');
    } finally {
      setSavingProgress(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="app-container max-w-6xl">
        <div className="page-hero stagger-fade">
          <div className="relative z-10">
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <span className="page-kicker">Career Design</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-50 mt-4">Career Guidance</h1>
            <p className="text-gray-600 dark:text-slate-300 mt-3 max-w-2xl">Explore paths, save guidance, and track career progress inside a more editorial, premium planning workspace.</p>
            <div className="hero-metrics">
              <div className="hero-metric"><p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Templates</p><p className="mt-2 text-2xl font-bold text-blue-600">{CAREER_PATHS.length}</p></div>
              <div className="hero-metric"><p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Milestones</p><p className="mt-2 text-2xl font-bold text-emerald-600">{progressItems.length}</p></div>
              <div className="hero-metric"><p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Resources</p><p className="mt-2 text-2xl font-bold text-violet-600">{resources.length}</p></div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-slate-700 flex-wrap">
          {[
            ['paths', 'Career Paths', <FaCompass key="paths" />],
            ['guidance', 'My Guidance', <FaBriefcase key="guidance" />],
            ['resources', 'Resources', <FaBookOpen key="resources" />],
            ['progress', 'Progress', <FaChartLine key="progress" />]
          ].map(([key, label, icon]) => (
            <button
              key={key}
              onClick={() => setSelectedTab(key)}
              className={`px-6 py-3 font-semibold border-b-2 transition flex items-center gap-2 rounded-t-2xl ${
                selectedTab === key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100'
              }`}
            >
              <span className="text-sm">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {selectedTab === 'paths' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREER_PATHS.map((path) => (
              <Card key={path.id} hoverable>
                <CardBody>
                  <div className="text-4xl mb-3">{path.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{path.title}</h3>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Popular Roles:</p>
                    <div className="flex flex-wrap gap-2">
                      {path.roles.map((role, idx) => (
                        <Badge key={idx} variant="primary">{role}</Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Average Salary: <strong>{path.avgSalary}</strong></p>
                  <Button variant="secondary" fullWidth size="sm" onClick={() => applyPathTemplate(path)}>
                    Use This Path
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'guidance' && (
          <div className="space-y-6">
            {(careerPathError || historyError || guidanceMessage) && (
              <Alert
                type={careerPathError || historyError || guidanceMessage.toLowerCase().includes('failed') ? 'error' : 'success'}
                message={careerPathError || historyError || guidanceMessage}
                dismissible
                onClose={() => setGuidanceMessage('')}
              />
            )}

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaBullseye className="text-blue-600" />
                  Create or Update Guidance
                </h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSaveGuidance} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Career Goal</label>
                    <input className="w-full border border-gray-300 rounded p-2" value={careerGoal} onChange={(e) => setCareerGoal(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Role</label>
                    <input className="w-full border border-gray-300 rounded p-2" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <input className="w-full border border-gray-300 rounded p-2" value={experience} onChange={(e) => setExperience(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Guidance Notes</label>
                    <textarea className="w-full border border-gray-300 rounded p-2" rows="4" value={guidance} onChange={(e) => setGuidance(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Recommended Actions (comma separated)</label>
                    <textarea className="w-full border border-gray-300 rounded p-2" rows="3" value={recommendedActionsText} onChange={(e) => setRecommendedActionsText(e.target.value)} />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" variant="primary" loading={savingGuidance}>Save Guidance</Button>
                    <Button type="button" variant="secondary" onClick={clearGuidanceForm}>New Goal</Button>
                  </div>
                </form>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">Latest Saved Guidance</h2>
              </CardHeader>
              <CardBody>
                {careerPathLoading ? (
                  <Loading message="Loading latest guidance..." />
                ) : careerPath ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700"><strong>Goal:</strong> {careerPath.career_goal}</p>
                    <p className="text-sm text-gray-700"><strong>Current Role:</strong> {careerPath.current_role}</p>
                    <p className="text-sm text-gray-700"><strong>Experience:</strong> {careerPath.experience || 'Not specified'}</p>
                    <p className="text-sm text-gray-700"><strong>Guidance:</strong> {careerPath.guidance || 'No guidance text provided yet.'}</p>
                    <p className="text-sm text-gray-700"><strong>Actions:</strong> {parseActions(careerPath.recommended_actions).join(', ') || 'None yet'}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">No saved guidance yet.</p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">Guidance History</h2>
              </CardHeader>
              <CardBody>
                {historyLoading ? (
                  <Loading message="Loading history..." />
                ) : historyList.length === 0 ? (
                  <p className="text-gray-600">No guidance history yet.</p>
                ) : (
                  <div className="space-y-3">
                    {historyList.map((item) => (
                      <div key={item.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <p className="font-semibold text-gray-900">{item.career_goal}</p>
                        <p className="text-sm text-gray-600">Role: {item.current_role}</p>
                        <p className="text-sm text-gray-600">{new Date(item.created_at || item.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        {selectedTab === 'resources' && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Career Resources</h2>
            </CardHeader>
            <CardBody>
              {resourcesLoading ? (
                <Loading message="Loading resources..." />
              ) : resourcesError ? (
                <Alert type="error" message={resourcesError} />
              ) : resources.length === 0 ? (
                <Alert type="info" message="No resources available yet." dismissible={false} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((resource) => (
                    <div key={resource.id} className="p-4 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                      <p className="font-semibold text-gray-900">{resource.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <Badge variant="primary">{resource.type}</Badge>
                        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Visit Resource
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {selectedTab === 'progress' && (
          <div className="space-y-6">
            {(progressMessage || progressError) && (
              <Alert
                type={progressError || progressMessage.toLowerCase().includes('failed') ? 'error' : 'success'}
                message={progressError || progressMessage}
                dismissible
                onClose={() => setProgressMessage('')}
              />
            )}

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">Track New Milestone</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleTrackProgress} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Goal</label>
                    <input className="w-full border border-gray-300 rounded p-2" value={trackGoal} onChange={(e) => setTrackGoal(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Milestone</label>
                    <input className="w-full border border-gray-300 rounded p-2" value={trackMilestone} onChange={(e) => setTrackMilestone(e.target.value)} />
                  </div>
                  <Button type="submit" variant="primary" loading={savingProgress}>Save Milestone</Button>
                </form>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaTasks className="text-blue-600" />
                  Progress History
                </h2>
              </CardHeader>
              <CardBody>
                {progressLoading ? (
                  <Loading message="Loading progress..." />
                ) : progressItems.length === 0 ? (
                  <p className="text-gray-600">No milestones tracked yet.</p>
                ) : (
                  <div className="space-y-3">
                    {progressItems.map((item) => (
                      <div key={item.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <p className="font-semibold text-gray-900">{item.goal}</p>
                        <p className="text-sm text-gray-600">{item.milestone}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(item.created_at || item.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
