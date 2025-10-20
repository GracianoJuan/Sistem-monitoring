
const Header = ({title}, user, onLogout) => {
    
    return (
        <header className="bg-blue-600 shadow-sm border-b-1-blue">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-white">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;