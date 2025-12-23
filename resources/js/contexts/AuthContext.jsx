// resources/js/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/ApiServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check for recovery token in URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        if (token && email) {
          setIsRecoveryMode(true);
        }

        // Get session from backend (reads HttpOnly cookie)
        const resp = await apiClient.get('/auth/me');
        const session = resp.data?.data?.session ?? null;
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => { };
  }, []);

  const signup = async (email, password, displayName) => {
    try {
      const res = await apiClient.post('/auth/register', { email, password, name: displayName });
      return { success: true, message: res.data.message ?? 'Registered', needsConfirmation: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      // store access_token from response as fallback (for cross-origin dev)
      if (res.data?.access_token) {
        try { localStorage.setItem('access_token', res.data.access_token); } catch (e) { }
      }
      // refresh session
      const me = await apiClient.get('/auth/me');
      const session = me.data?.data?.session ?? null;
      setIsRecoveryMode(false);
      setSession(session);
      setUser(session?.user ?? null);
      return { success: true, message: res.data.message ?? 'Login successful' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      setUser(null);
      setSession(null);
      setIsRecoveryMode(false);
      try { localStorage.removeItem('access_token'); } catch (e) { }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      const res = await apiClient.post('/auth/forgot', { email });
      return { success: true, message: res.data.message ?? 'Reset email sent' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const verifyResetToken = async (token, email) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-reset?token=${token}&email=${encodeURIComponent(email)}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || 'Invalid or expired token' };
      }

      return { success: true, message: 'Token verified' };
    } catch (error) {
      console.error('Token verification error:', error);
      return { success: false, message: 'Failed to verify token' };
    }
  };

  const updatePassword = async (password, token, email) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          token: token,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || 'Failed to update password' };
      }

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, message: 'Failed to update password' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isRecoveryMode,
      signup,
      login,
      logout,
      resetPassword,
      verifyResetToken,
      updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};