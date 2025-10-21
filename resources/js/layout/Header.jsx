
const Header = ({ title }) => {

    return (
        <header className="bg-blue-600 shadow-sm border-b-1-blue">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-white">
                            {title}
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;