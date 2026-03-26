/**
 * Navigation Component
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useCustomHooks';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            MEND
          </Link>

          <div className="flex gap-6 items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Dashboard
                </Link>
                <Link to="/assessments" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Assessments
                </Link>
                <Link to="/sessions" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Sessions
                </Link>
                <Link to="/community" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Community
                </Link>
                <Link to="/career" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Career
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Login
                </Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
