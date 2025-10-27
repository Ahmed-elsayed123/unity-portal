import React, { createContext, useContext, useState, useEffect } from 'react';
import dataService from '../services/dataService.jsx';

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

  useEffect(() => {
    // Check for stored user data on app load
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Validate token format (for mock tokens)
          if (token.startsWith('mock_token_')) {
            setUser(userData);
            dataService.setToken(token);
            console.log('User session restored from localStorage');
          } else {
            // For real tokens, you might want to validate with the server
            setUser(userData);
            dataService.setToken(token);
            console.log('User session restored from localStorage');
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // Mock authentication for development
      const mockUsers = {
        'student@unity.edu': { id: 1, firstName: 'John', lastName: 'Student', role: 'student', email: 'student@unity.edu' },
        'lecturer@unity.edu': { id: 2, firstName: 'Dr. Smith', lastName: 'Lecturer', role: 'lecturer', email: 'lecturer@unity.edu' },
        'admin@unity.edu': { id: 3, firstName: 'Admin', lastName: 'User', role: 'admin', email: 'admin@unity.edu' }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = mockUsers[credentials.email];
      
      if (user && credentials.password === 'password123') {
        const userData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        };
        
        // Generate a mock token for development
        const mockToken = `mock_token_${user.id}_${Date.now()}`;
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', mockToken);
        dataService.setToken(mockToken);
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      // For development - no API call needed
      // await dataService.logout(); // Uncomment when backend is ready
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const register = async (userData) => {
    try {
      // Mock registration for development
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Simulate successful registration
      const newUserData = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role
      };
      
      const mockToken = `mock_token_${newUserData.id}_${Date.now()}`;
      
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
      localStorage.setItem('token', mockToken);
      dataService.setToken(mockToken);
      
      return { success: true, user: newUserData };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  // Check if user is already logged in
  const isLoggedIn = () => {
    return user !== null;
  };

  // Get stored user data without triggering re-render
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  };

  // Clear session data
  const clearSession = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    dataService.clearToken();
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isLoggedIn,
    getStoredUser,
    clearSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
