import { ChevronLeft, ChevronRight, LogOut, BarChart3, Users, Table2, Menu, X } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { useNavigate } from 'react-router-dom';
import logo from '../misc/logo.png';
import { useState } from 'react';

const SidebarComponent = ({ isOpen, setOpen, onLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { userRole } = useRole();
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Table2,
      roles: ['admin', 'editor', 'viewer']
    },
    {
      name: 'Chart',
      href: '/chart',
      icon: BarChart3,
      roles: ['admin', 'editor', 'viewer']
    },
    {
      name: 'Manage Users',
      href: '/admin/users',
      icon: Users,
      roles: ['admin']
    }
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile menu button - TIDAK OVERLAY CONTENT */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-700"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-gray-100 text-black h-screen fixed left-0 top-0 transition-all duration-300 shadow-lg hidden md:flex flex-col z-30`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {isOpen ? (
            <div className="flex items-center space-x-3">
              <img src={logo} alt="logo" className="h-15 w-auto rounded" />
            </div>
          ) : ''}
          
          <button
            onClick={() => setOpen(!isOpen)}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            title={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* User Role Badge */}
        {isOpen && (
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-xs text-black mb-2">Current Role</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor()}`}>
              {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.href;

            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-700 hover:text-white'
                }`}
                title={!isOpen ? item.name : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isOpen && <span className="text-sm font-medium">{item.name}</span>}
              </a>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              isOpen ? 'space-x-3' : 'justify-center'
            } px-4 py-3 rounded-lg text-red-500 hover:bg-red-600 hover:text-white transition-colors`}
            title="Logout"
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 backdrop-brightness-50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          
          <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-100 text-black shadow-lg flex flex-col z-50 md:hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="logo" className="h-15 w-auto rounded" />
              </div>
            </div>

            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-xs text-black mb-2">Current Role</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor()}`}>
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
              </span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = window.location.pathname === item.href;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-black hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </a>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-600 hover:text-white transition-colors"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default SidebarComponent;