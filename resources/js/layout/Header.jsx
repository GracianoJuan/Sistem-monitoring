const Header = ({ title }) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;