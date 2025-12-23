import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ChartBar, 
  LogOut, 
  Menu, 
  X,
  Upload
} from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import logo from '../misc/logo.png';

const SidebarComponent = ({ isOpen, setOpen, onLogout }) => {
  const location = useLocation();
  const { userRole } = useRole();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      show: true 
    },
    { 
      path: '/import', 
      icon: Upload, 
      label: 'Import Excel',
      show: userRole === 'admin' || userRole === 'editor'
    },
    { 
      path: '/chart', 
      icon: ChartBar, 
      label: 'Charts',
      show: true 
    },
    { 
      path: '/admin/users', 
      icon: Users, 
      label: 'Manage Users',
      show: userRole === 'admin'
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {isOpen ? (
            <div className="flex items-center space-x-3">
              <img src={logo} alt="logo" className="h-15 w-auto rounded" />
            </div>
          ) : ''}
            <button
              onClick={() => setOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={!isOpen ? item.label : ''}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {isOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={!isOpen ? 'Logout' : ''}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarComponent;