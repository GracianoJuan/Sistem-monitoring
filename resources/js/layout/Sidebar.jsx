// resources/js/layout/Sidebar.jsx
import { useState } from 'react';
import { ChevronDown, LogOut, BarChart3, Users, Table2, Menu, X } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { useNavigate } from 'react-router-dom';
import logo from '../misc/logo.png';

const SidebarComponent = ({ currentPage, onLogout }) => {
  const [isOpen, setOpen] = useState(true);
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
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-blue-900 text-white rounded-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen fixed left-0 top-0 transition-all duration-300 shadow-lg hidden md:flex flex-col`}>
        
        {/* Logo Section */}
        <div className="p-4 border-b border-blue-700 flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <img src={logo} alt="logo" className="h-8 w-8 rounded" />
              <span className="font-bold text-lg">App</span>
            </div>
          )}
          <button
            onClick={() => setOpen(!isOpen)}
            className="p-1 hover:bg-blue-700 rounded transition-colors ml-auto"
            title={isOpen ? 'Collapse' : 'Expand'}
          >
            <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-0' : 'rotate-90'}`} />
          </button>
        </div>

        {/* User Role Badge */}
        {isOpen && (
          <div className="px-4 py-3 border-b border-blue-700 bg-blue-800">
            <p className="text-xs text-blue-200 mb-2">Role</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor()}`}>
              {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.href;

            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
                title={!isOpen ? item.name : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isOpen && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-blue-700 mx-4"></div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg text-red-200 hover:bg-red-600 hover:text-white transition-colors`}
            title="Logout"
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)}></div>
          <div className="absolute left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg flex flex-col">
            <div className="p-4 border-b border-blue-700">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="logo" className="h-8 w-8 rounded" />
                <span className="font-bold text-lg">App</span>
              </div>
            </div>

            <div className="px-4 py-3 border-b border-blue-700 bg-blue-800">
              <p className="text-xs text-blue-200 mb-2">Role</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor()}`}>
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
              </span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </a>
                );
              })}
            </nav>

            <div className="border-t border-blue-700 p-4">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-600 hover:text-white transition-colors"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarComponent;