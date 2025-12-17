import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState('viewer');

  useEffect(() => {
    if (user) {
      const role = user.role || (user.user_metadata?.role) || 'viewer';
      console.log('Role set to:', role);
      setUserRole(role);
    }
  }, [user]);

  const hasRole = (requiredRoles) => {
    if (!Array.isArray(requiredRoles)) {
      requiredRoles = [requiredRoles];
    }
    return requiredRoles.includes(userRole);
  };

  const hasPermission = (action) => {
    const permissions = {
      'view': ['admin', 'editor', 'viewer'],
      'view_stats': ['admin', 'editor', 'viewer'],
      'view_users': ['admin'],
      'create': ['admin', 'editor'],
      'edit': ['admin', 'editor'],
      'delete': ['admin', 'editor'],
      'export': ['admin', 'editor', 'viewer'],
      'manage_users': ['admin'],
      'edit_user_role': ['admin'],
      'delete_user': ['admin']
    };

    const allowedRoles = permissions[action] || [];
    return allowedRoles.includes(userRole);
  };

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

  const value = {
    userRole,
    hasRole,
    hasPermission,
    getRoleBadgeColor
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};