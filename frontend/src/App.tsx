import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { useAuth } from './hooks/useAuth';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { AppLayout } from './layouts/AppLayout';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { GraphPage } from './pages/GraphPage';
import { DiscoveriesPage } from './pages/DiscoveriesPage';
import { SourcesPage } from './pages/SourcesPage';
import { TimelinePage } from './pages/TimelinePage';
import { QueryPage } from './pages/QueryPage';
import { SimulationPage } from './pages/SimulationPage';
import { api } from './services/api';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#060B10] text-slate-300 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Authenticating RealityGraph session...</span>
        </div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const WorkspaceEntryRedirect: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    api.getWorkspaces()
      .then(workspaces => {
        if (workspaces && workspaces.length > 0) {
          navigate(`/workspace/${workspaces[0].id}/command-center`, { replace: true });
        } else {
          api.createWorkspace({ name: 'Campus Intelligence (Default)' })
            .then(ws => navigate(`/workspace/${ws.id}/command-center`, { replace: true }))
            .catch(() => navigate('/login', { replace: true }));
        }
      })
      .catch(() => {
        navigate('/login', { replace: true });
      });
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#060B10] text-slate-300 text-xs font-mono">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span>Loading Workspace...</span>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthPage isRegister={false} />} />
              <Route path="/register" element={<AuthPage isRegister={true} />} />

              {/* Protected Workspace Routes */}
              <Route
                path="/workspace"
                element={
                  <ProtectedRoute>
                    <WorkspaceEntryRedirect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workspace/:workspaceId"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="command-center" replace />} />
                <Route path="command-center" element={<CommandCenterPage />} />
                <Route path="graph" element={<GraphPage />} />
                <Route path="discoveries" element={<DiscoveriesPage />} />
                <Route path="sources" element={<SourcesPage />} />
                <Route path="timeline" element={<TimelinePage />} />
                <Route path="query" element={<QueryPage />} />
                <Route path="simulate" element={<SimulationPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

