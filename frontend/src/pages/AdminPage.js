/**
 * Admin Page
 */
import React from 'react';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/70">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    </div>
  );
};
