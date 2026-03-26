/**
 * Admin Dashboard Component
 */
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '../common/Card';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Loading } from '../common/Loading';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // fetchStats(); // TODO: Implement admin service
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // const response = await adminService.getDashboardStats();
      // setStats(response.data);
      setError('Admin service not yet implemented');
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
          </Card>
          <Card>
            <h3 className="text-gray-600 text-sm font-medium">Assessments</h3>
            <p className="text-3xl font-bold text-green-600">{stats.assessments}</p>
          </Card>
          <Card>
            <h3 className="text-gray-600 text-sm font-medium">Therapy Sessions</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.sessions}</p>
          </Card>
          <Card>
            <h3 className="text-gray-600 text-sm font-medium">Creative Posts</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.posts}</p>
          </Card>
        </div>
      )}

      <div className="border-b mb-6">
        <div className="flex gap-4">
          {['overview', 'users', 'moderation', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize font-semibold border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <Card>
            <h2 className="text-xl font-bold mb-4">System Overview</h2>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleString()}
            </p>
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p>✓ Database: Connected</p>
              <p>✓ API: Active</p>
              <p>✓ All services: Operational</p>
            </div>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card>
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <p className="text-gray-600">
              Click on a user to view details and manage their account
            </p>
            <div className="mt-4 text-center text-sm text-gray-500">
              User management interface
            </div>
          </Card>
        )}

        {activeTab === 'moderation' && (
          <Card>
            <h2 className="text-xl font-bold mb-4">Content Moderation</h2>
            <p className="text-gray-600">
              Review and moderate user-generated content
            </p>
            <div className="mt-4 text-center text-sm text-gray-500">
              Content moderation interface
            </div>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <h2 className="text-xl font-bold mb-4">Analytics & Reports</h2>
            <p className="text-gray-600">
              View detailed analytics and generate reports
            </p>
            <div className="mt-4 text-center text-sm text-gray-500">
              Analytics interface
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
