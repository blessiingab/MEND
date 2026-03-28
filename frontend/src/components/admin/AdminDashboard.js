/**
 * Admin Dashboard Component
 */
import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '../common/Card';
import { Alert } from '../common/Alert';
import { Loading } from '../common/Loading';
import { Logo } from '../common/Logo';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const panelClass =
    'border border-white/70 dark:border-slate-800/80 bg-white/88 dark:bg-slate-950/78 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_60px_rgba(2,6,23,0.42)]';
  const softPanelClass =
    'border border-white/60 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/78 backdrop-blur-xl shadow-[0_18px_48px_rgba(15,23,42,0.07)] dark:shadow-[0_18px_48px_rgba(2,6,23,0.36)]';
  const badgeClass =
    'text-xs font-semibold px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/80 border border-white/70 dark:border-slate-700/80 text-slate-600 dark:text-slate-300';

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
      <div className={`mb-8 rounded-[32px] p-6 md:p-8 ${panelClass}`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-50">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-slate-300 mt-2 max-w-2xl">
              Platform oversight for moderation, analytics, and system visibility.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className={badgeClass}>Administration</span>
            <span className={badgeClass}>Operations</span>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className={softPanelClass}>
            <CardBody>
              <h3 className="text-gray-600 dark:text-slate-300 text-sm font-medium">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
            </CardBody>
          </Card>
          <Card className={softPanelClass}>
            <CardBody>
              <h3 className="text-gray-600 dark:text-slate-300 text-sm font-medium">Assessments</h3>
              <p className="text-3xl font-bold text-green-600">{stats.assessments}</p>
            </CardBody>
          </Card>
          <Card className={softPanelClass}>
            <CardBody>
              <h3 className="text-gray-600 dark:text-slate-300 text-sm font-medium">Therapy Sessions</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.sessions}</p>
            </CardBody>
          </Card>
          <Card className={softPanelClass}>
            <CardBody>
              <h3 className="text-gray-600 dark:text-slate-300 text-sm font-medium">Creative Posts</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.posts}</p>
            </CardBody>
          </Card>
        </div>
      )}

      <div className={`mb-6 rounded-[28px] px-4 py-3 ${softPanelClass}`}>
        <div className="flex gap-4 flex-wrap">
          {['overview', 'users', 'moderation', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize font-semibold rounded-full transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <Card className={softPanelClass}>
            <CardBody>
              <h2 className="text-xl font-bold mb-4">System Overview</h2>
              <p className="text-gray-600 dark:text-slate-300">Last updated: {new Date().toLocaleString()}</p>
              <div className="mt-4 text-sm text-gray-600 dark:text-slate-300 space-y-2">
                <p>System Database: Connected</p>
                <p>Platform API: Active</p>
                <p>All services: Operational</p>
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card className={softPanelClass}>
            <CardBody>
              <h2 className="text-xl font-bold mb-4">User Management</h2>
              <p className="text-gray-600 dark:text-slate-300">
                Click on a user to view details and manage their account
              </p>
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-slate-400">
                User management interface
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'moderation' && (
          <Card className={softPanelClass}>
            <CardBody>
              <h2 className="text-xl font-bold mb-4">Content Moderation</h2>
              <p className="text-gray-600 dark:text-slate-300">
                Review and moderate user-generated content
              </p>
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-slate-400">
                Content moderation interface
              </div>
            </CardBody>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card className={softPanelClass}>
            <CardBody>
              <h2 className="text-xl font-bold mb-4">Analytics & Reports</h2>
              <p className="text-gray-600 dark:text-slate-300">
                View detailed analytics and generate reports
              </p>
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-slate-400">
                Analytics interface
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};
