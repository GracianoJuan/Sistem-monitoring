import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import SidebarComponent from './layout/Sidebar';
import { useRole } from './contexts/RoleContext';
import ChartPage from './pages/Chart';
import Test from './pages/test';
import Header from './layout/Header';


function App() {
  const { user, session, logout, loading: authLoading } = useAuth();
  const { userRole, loading: roleLoading } = useRole();
  const [sidebarOpen, setOpen] = useState();

  const canEdit = userRole == 'admin' || userRole == 'editor' ? true : false;

  // Show loading while auth and role are loading
  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show login page
  if (!user || !session) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Logged in - show main app with sidebar
  return (
    <div>

      <BrowserRouter>

        <div className="flex h-screen bg-gray-100">

          {/* Sidebar */}
          <SidebarComponent
            currentPage="Dashboard"
            onLogout={logout}
          />


          {/* Main Content */}
          <div className="flex-1 md:ml-64 overflow-auto">
            <Header title='Dashboard' />
            <Routes>

              {/* Dashboard route */}
              <Route
                path="/dashboard"
                element={<Dashboard user={user} session={session} canEdit={canEdit} handleLogout={logout} />}
              />

              {/* Admin only route */}
              <Route
                path="/admin/users"
                element={
                  userRole === 'admin' 
                    ? 
                    // <ManageUsers handleLogout={logout} />
                  <Test />
                    : <Navigate to="/dashboard" replace />
                }
              />

              {/* Chart route - placeholder */}
              <Route
                path="/chart"
                element={<ChartPage />}
              />

              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;