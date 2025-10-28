import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTitle = () => {
  const location = useLocation();
  const [title, setTitle] = useState('Dashboard');

  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/dashboard') {
      setTitle('Dashboard');
    } else if (path === '/chart') {
      setTitle('Chart');
    } else if (path === '/admin/users') {
      setTitle('Manage Users');
    } else {
      setTitle('Page');
    }
  }, [location]);

  return title;
};