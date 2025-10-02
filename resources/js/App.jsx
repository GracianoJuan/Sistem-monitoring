// resources/js/components/MainApp.jsx
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import LoadingSpinner from './components/LoadingSpinner';

const App = () => {
    const { user, loading, isAuthenticated, login, logout } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Login onLogin={login} />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 shadow-sm border-b-1-blue">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-white">
                                Dashboard Pengadaan & Amandemen
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <Dashboard user={user} />
        </div>
    );
};

export default App;