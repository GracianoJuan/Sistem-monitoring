// resources/js/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check for recovery token in URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (type === 'recovery' && accessToken) {
          // User clicked reset password link
          setIsRecoveryMode(true);
          
          // Set the session from the recovery token
          const { data: { session: recoverySession }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token')
          });

          if (!error && recoverySession) {
            setSession(recoverySession);
            setUser(recoverySession.user);
          }
          
          setLoading(false);
          return;
        }

        // Normal session check
        const { data: { session }, error } = await supabase.auth.getSession();
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        // Don't update state on PASSWORD_RECOVERY event
        if (event === 'PASSWORD_RECOVERY') {
          setIsRecoveryMode(true);
          setSession(session);
          setUser(session?.user);
        } else if (event === 'SIGNED_OUT') {
          setIsRecoveryMode(false);
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user);
        }
        
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: displayName,
            role: 'viewer' // DEFAULT ROLE FOR NEW USERS
          }
        }
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Signup successful! Please check your email to confirm.',
        needsConfirmation: true
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setIsRecoveryMode(false); // Clear recovery mode on normal login
      return { success: true, message: 'Login successful' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsRecoveryMode(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      
      if (error) throw error;
      
      return { 
        success: true, 
        message: 'Password reset email sent! Please check your inbox.' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  };

  // ← TAMBAHKAN FUNGSI INI
  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // After successful password update, logout user
      await logout();

      return { 
        success: true, 
        message: 'Password updated successfully!' 
      };
    } catch (error) {
      console.error('Update password error:', error);
      return { 
        success: false, 
        message: error.message 
      };
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
      updatePassword // ← EXPORT INI
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