import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import ExcelImport from './pages/ExcelImport';
import SidebarComponent from './layout/Sidebar';
import { useRole } from './contexts/RoleContext';
import ChartPage from './pages/Chart';
import Header from './layout/Header';
import { usePageTitle } from './hooks/usePageTitle';

// Main Layout Component
const MainLayout = ({ children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const title = usePageTitle();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <SidebarComponent
        isOpen={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      {/* Main Content - Dynamic margin based on sidebar state */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarOpen ? 'md:ml-64' : 'md:ml-20'
      }`}>
        <Header title={title} />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const { user, session, logout, loading: authLoading, isRecoveryMode } = useAuth();
  const { userRole, loading: roleLoading } = useRole();

  const canEdit = userRole === 'admin' || userRole === 'editor';

  // penyakit loading state
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

  return (
    <BrowserRouter>
      <Routes>
        {/* Login page - handles all auth modes including password reset */}
        <Route path="/login" element={
          (!user || isRecoveryMode) ? <Login /> : <Navigate to="/dashboard" replace />
        } />

        {/* Protected routes */}
        {user && session && !isRecoveryMode ? (
          <Route path="/*" element={
            <MainLayout onLogout={logout}>
              <Routes>
                <Route
                  path="/dashboard"
                  element={<Dashboard user={user} session={session} canEdit={canEdit} handleLogout={logout} />}
                />

                <Route
                  path="/admin/users"
                  element={
                    userRole === 'admin' ? (
                      <ManageUsers handleLogout={logout} />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                          <p className="text-gray-600">You don't have permission to access this page.</p>
                        </div>
                      </div>
                    )
                  }
                />

                <Route 
                  path="/import" 
                  element={
                    canEdit ? (
                      <ExcelImport />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                          <p className="text-gray-600">You don't have permission to import data.</p>
                        </div>
                      </div>
                    )
                  } 
                />

                <Route path="/chart" element={<ChartPage />} />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </MainLayout>
          } />
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;