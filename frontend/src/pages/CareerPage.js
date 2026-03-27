/**
 * Career Guidance Page
 */
import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Loading';
import { CareerResources } from '../components/career/CareerResources';

export const CareerPage = () => {
  const [selectedTab, setSelectedTab] = useState('paths');

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
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">Your Personalized Career Guidance</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Your Ideal Role</p>
                  <p className="text-lg font-bold text-gray-900">Software Engineer</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Required Skills</p>
                  <p className="text-lg font-bold text-gray-900">7/10</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Estimated Timeline</p>
                  <p className="text-lg font-bold text-gray-900">18 Months</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Next Steps</h3>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <p className="text-gray-700">Complete core programming courses</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <p className="text-gray-700">Build a portfolio with 3-5 projects</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <p className="text-gray-700">Network with professionals in tech</p>
                  </li>
               <li className="flex gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                    <p className="text-gray-700">Apply to entry-level positions</p>
                  </li>
                </ol>
              </div>
              <Button variant="primary" size="lg" fullWidth>
                Get Personalized Guidance
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Resources Tab */}
        {selectedTab === 'resources' && (
          <CareerResources />
        )}
      </div>
    </div>
  );
};
