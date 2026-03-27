/**
 * Career Guidance Page
 */
import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Loading';
import { CareerResources } from '../components/career/CareerResources';
import { Alert } from '../components/common/Alert';
import { useFetch, useForm } from '../hooks/useCustomHooks';
import { careerService } from '../services/api';

export const CareerPage = () => {
  const [selectedTab, setSelectedTab] = useState('paths');
  const [guidanceMessage, setGuidanceMessage] = useState('');

  const { data: careerPath, loading: careerPathLoading, error: careerPathError, refetch: refetchCareerPath } = useFetch(
    () => careerService.getMyPath(),
    []
  );

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, reset } = useForm(
    {
      careerGoal: careerPath?.career_goal || '',
      currentRole: careerPath?.current_role || '',
      experience: careerPath?.experience || '',
      guidance: careerPath?.guidance || '',
      recommendedActions: careerPath?.recommended_actions || ''
    },
    async (values) => {
      try {
        setGuidanceMessage('');
        await careerService.createGuidanceSession(
          values.careerGoal,
          values.currentRole,
          values.experience,
          values.guidance,
          values.recommendedActions
        );
        setGuidanceMessage('Your career guidance has been saved successfully.');
        reset();
        refetchCareerPath();
      } catch (err) {
        setGuidanceMessage(err.message || 'Failed to save guidance.');
      }
    }
  );

  const careerResources = [
    {
      id: 1,
      title: 'Resume Writing Guide',
      description: 'Learn how to create an effective resume that stands out.',
      link: '#'
    },
    {
      id: 2,
      title: 'Interview Preparation',
      description: 'Tips and tricks for successful job interviews.',
      link: '#'
    },
    {
      id: 3,
      title: 'Career Path Planning',
      description: 'Identify and plan your ideal career trajectory.',
      link: '#'
    },
    {
      id: 4,
      title: 'Skill Development',
      description: 'Discover key skills needed for your target role.',
      link: '#'
    },
    {
      id: 5,
      title: 'Networking Strategies',
      description: 'Build meaningful professional connections.',
      link: '#'
    },
    {
      id: 6,
      title: 'Job Search Tips',
      description: 'Effective strategies for finding job opportunities.',
      link: '#'
    }
  ];

  const careerPaths = [
    {
      id: 1,
      title: 'Tech & Software',
      icon: '💻',
      roles: ['Software Engineer', 'Data Analyst', 'UI/UX Designer'],
      avgSalary: '$80k-$150k'
    },
    {
      id: 2,
      title: 'Healthcare',
      icon: '⚕️',
      roles: ['Nurse', 'Doctor', 'Therapist'],
      avgSalary: '$60k-$200k'
    },
    {
      id: 3,
      title: 'Business & Finance',
      icon: '💼',
      roles: ['Accountant', 'Financial Analyst', 'Business Manager'],
      avgSalary: '$50k-$180k'
    },
    {
      id: 4,
      title: 'Education',
      icon: '📚',
      roles: ['Teacher', 'Trainer', 'Counselor'],
      avgSalary: '$40k-$100k'
    },
    {
      id: 5,
      title: 'Creative & Arts',
      icon: '🎨',
      roles: ['Graphic Designer', 'Copywriter', 'Content Creator'],
      avgSalary: '$35k-$120k'
    },
    {
      id: 6,
      title: 'Sales & Marketing',
      icon: '📊',
      roles: ['Sales Manager', 'Marketing Specialist', 'Brand Manager'],
      avgSalary: '$45k-$150k'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Career Guidance</h1>
          <p className="text-gray-600 mt-2">Explore career paths, resources, and personalized guidance</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('paths')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              selectedTab === 'paths'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Career Paths
          </button>
          <button
            onClick={() => setSelectedTab('guidance')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              selectedTab === 'guidance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Get Your Guidance
          </button>
          <button
            onClick={() => setSelectedTab('resources')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              selectedTab === 'resources'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Resources
          </button>
        </div>

        {/* Career Paths Tab */}
        {selectedTab === 'paths' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerPaths.map((path) => (
              <Card key={path.id} hoverable>
                <CardBody>
                  <div className="text-4xl mb-3">{path.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{path.title}</h3>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Roles:</p>
                    <div className="flex flex-wrap gap-2">
                      {path.roles.map((role, idx) => (
                        <Badge key={idx} variant="primary">{role}</Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Average Salary: <strong>{path.avgSalary}</strong></p>
                  <Button variant="secondary" fullWidth size="sm">
                    Learn More
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Guidance Tab */}
        {selectedTab === 'guidance' && (
          <div className="space-y-6">
            {careerPathLoading ? (
              <Card>
                <CardBody>
                  <p className="text-gray-600">Loading your guidance path...</p>
                </CardBody>
              </Card>
            ) : careerPathError ? (
              <Alert type="error" message="Unable to load your career path" />
            ) : careerPath ? (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">Your Saved Career Path</h2>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-gray-600">Goal: {careerPath.career_goal}</p>
                  <p className="text-sm text-gray-600">Current Role: {careerPath.current_role}</p>
                  <p className="text-sm text-gray-600">Experience: {careerPath.experience}</p>
                  <p className="text-sm text-gray-600 mt-3">Guidance: {careerPath.guidance}</p>
                  <p className="text-sm text-gray-600 mt-3">Recommended Actions: {careerPath.recommended_actions}</p>
                  <Button variant="secondary" className="mt-4" onClick={() => setSelectedTab('guidance')}>Reload</Button>
                </CardBody>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">Create Your Career Guidance</h2>
                </CardHeader>
                <CardBody>
                  {guidanceMessage && (
                    <div className="mb-4 text-sm text-green-700 bg-green-100 p-2 rounded">{guidanceMessage}</div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Career Goal</label>
                      <input
                        name="careerGoal"
                        value={values.careerGoal}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-300 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Role</label>
                      <input
                        name="currentRole"
                        value={values.currentRole}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-300 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <input
                        name="experience"
                        value={values.experience}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-300 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Guidance</label>
                      <textarea
                        name="guidance"
                        value={values.guidance}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-300 rounded p-2"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Recommended Actions</label>
                      <textarea
                        name="recommendedActions"
                        value={values.recommendedActions}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-300 rounded p-2"
                        rows="3"
                      />
                    </div>
                    <Button type="submit" variant="primary" fullWidth>
                      Save Guidance
                    </Button>
                  </form>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {selectedTab === 'resources' && (
          <CareerResources />
        )}
      </div>
    </div>
  );
};
