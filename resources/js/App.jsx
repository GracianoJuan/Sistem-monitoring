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
                                <svg width="15px" height="15px" className='inline' viewBox="0 0 12.00 12.00" enableBackground="new 0 0 12 12" id="Слой_1" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#FFFFFF" stroke="#FFFFFF" 
                                strokeWidth="0.00012000000000000002"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><polygon fill="#FFFFFF" points="9,2 9,0 1,0 1,12 9,12 9,10 8,10 8,11 2,11 2,1 8,1 8,2 "></polygon><polygon fill="#FFFFFF" points="8.2929688,3.2929688 7.5859375,4 9.0859375,5.5 5,5.5 5,6.5 9.0859375,6.5 7.5859375,8 8.2929688,8.7070313 11,6 "></polygon></g></svg
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