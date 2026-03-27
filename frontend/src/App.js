/**
 * Main App Component
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navigation } from './components/common/Navigation';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { SessionsPage } from './pages/SessionsPage';
import { CommunityPage } from './pages/CommunityPage';
import { CareerPage } from './pages/CareerPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

const AppContent = () => {
  const location = useLocation();
  const hideNavRoutes = ['/login', '/register'];
  const showNavigation = !hideNavRoutes.includes(location.pathname);

  return (
    <>
      {showNavigation && <Navigation />}
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Authenticated Users Only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assessments"
            element={
              <ProtectedRoute>
                <AssessmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sessions"
            element={
              <ProtectedRoute>
                <SessionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/career"
            element={
              <ProtectedRoute>
                <CareerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  };

export default App;
