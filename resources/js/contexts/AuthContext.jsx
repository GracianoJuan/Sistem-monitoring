// resources/js/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, signInWithEmail, signOut, getCurrentUser } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle specific auth events if needed
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.email);
            break;
          case 'SIGNED_OUT':
            console.log('User signed out');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
          case 'USER_UPDATED':
            console.log('User updated');
            break;
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const data = await signInWithEmail(email, password);
      
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        return { 
          success: true, 
          user: data.user,
          message: 'Login successful' 
        };
      }
      
      return { 
        success: false, 
        message: 'Login failed' 
      };
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle specific Supabase error types
      switch (error.message) {
        case 'Invalid login credentials':
          errorMessage = 'Invalid email or password. Please check your credentials.';
          break;
        case 'Email not confirmed':
          errorMessage = 'Please check your email and confirm your account before signing in.';
          break;
        case 'Too many requests':
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData // Additional user metadata
        }
      });
      
      if (error) throw error;
      
      return {
        success: true,
        user: data.user,
        message: 'Account created successfully! Please check your email to confirm your account.',
        needsConfirmation: !data.session // If no session, email confirmation is required
      };
      
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Signup failed. Please try again.';
      
      switch (error.message) {
        case 'User already registered':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'Password should be at least 6 characters':
          errorMessage = 'Password must be at least 6 characters long.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send reset email. Please try again.'
      };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) throw error;
      
      return {
        success: true,
        user: data.user,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    }
  };

  // Get access token for API calls
  const getAccessToken = async () => {
    if (!session) return null;
    
    const { data: { session: currentSession }, error } = await supabase.auth.getSession();
    if (error || !currentSession) return null;
    
    return currentSession.access_token;
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    signup,
    resetPassword,
    updateProfile,
    getAccessToken,
    isAuthenticated: !!user && !!session,
    isLoading: loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};