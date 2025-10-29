import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeOff, UserPlusIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');

  const { login, signup, resetPassword, updatePassword, loading, isRecoveryMode } = useAuth();

  // Check if user arrived via password reset link
  useEffect(() => {
    if (isRecoveryMode) {
      setMode('reset');
    }
  }, [isRecoveryMode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    if (message) setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation (not needed for reset mode)
    if (mode !== 'reset') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }
    
    // Password validation
    if (mode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      // Additional validations for signup and reset
      if (mode === 'signup' || mode === 'reset') {
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }

      // Name validation for signup only
      if (mode === 'signup') {
        if (!formData.name) {
          newErrors.name = 'Name is required';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      let result;
      
      switch (mode) {
        case 'login':
          result = await login(formData.email, formData.password);
          break;
          
        case 'signup':
          result = await signup(formData.email, formData.password, formData.name);
          break;
          
        case 'forgot':
          result = await resetPassword(formData.email);
          break;

        case 'reset':
          result = await updatePassword(formData.password);
          if (result.success) {
            setMessage('Password updated successfully! Redirecting to login...');
            setTimeout(() => {
              setMode('login');
              setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                name: ''
              });
            }, 2000);
            return;
          }
          break;
      }
      
      if (result.success) {
        if (mode === 'signup' && result.needsConfirmation) {
          setMessage(result.message);
          setMode('login');
        } else if (mode === 'forgot') {
          setMessage(result.message);
          setMode('login');
        }
      } else {
        setMessage(result.message);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setMessage('');
    setFormData({
      email: formData.email,
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const renderForm = () => {
    return (
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Enter your full name"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          )}

          {mode !== 'reset' && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          )}
          
          {mode !== 'forgot' && (
            <>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {mode === 'reset' ? 'New Password' : 'Password'}
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder={mode === 'reset' ? 'Enter new password' : 'Enter your password'}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {(mode === 'signup' || mode === 'reset') && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {message && (
          <div className={`border rounded-md p-3 ${
            message.includes('successful') || message.includes('sent') 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`text-sm ${
              message.includes('successful') || message.includes('sent')
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {message}
            </p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-3xl text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {mode === 'login' && 'Signing in...'}
                {mode === 'signup' && 'Creating account...'}
                {mode === 'forgot' && 'Sending email...'}
                {mode === 'reset' && 'Updating password...'}
              </div>
            ) : (
              <>
                {mode === 'login' && 'Sign in'}
                {mode === 'signup' && (
                  <>
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Create account
                  </>
                )}
                {mode === 'forgot' && 'Send reset email'}
                {mode === 'reset' && 'Reset Password'}
              </>
            )}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 border-sm p-8 rounded-2xl shadow-md bg-white">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
            {mode === 'reset' && 'Set New Password'}
          </h2>
          {mode === 'reset' && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your new password below
            </p>
          )}
        </div>
        
        {renderForm()}

        {mode !== 'reset' && (
          <div className="text-center space-y-2">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Don't have an account? Sign up
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </button>
              </>
            )}
            
            {mode === 'signup' && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Already have an account? Sign in
              </button>
            )}
            
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Remember your password? Sign in
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;