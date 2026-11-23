import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, eventsAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('c2c_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user data on startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to authenticate token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('c2c_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.data.success) {
      localStorage.setItem('c2c_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('c2c_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const isRegisteredForEvent = (eventId) => {
    if (!user || !user.registeredEvents) return false;
    return user.registeredEvents.some(id => (typeof id === 'object' ? id._id : id) === eventId);
  };

  const registerEvent = async (eventId) => {
    const res = await eventsAPI.registerForEvent(eventId);
    if (res.data.success) {
      // update local user state
      setUser(prev => {
        if (!prev) return prev;
        const currentRegistered = prev.registeredEvents || [];
        return {
          ...prev,
          registeredEvents: [...currentRegistered, eventId]
        };
      });
      return res.data;
    }
    throw new Error(res.data.message || 'Failed to register');
  };

  const cancelEvent = async (eventId) => {
    const res = await eventsAPI.cancelRegistration(eventId);
    if (res.data.success) {
      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          registeredEvents: (prev.registeredEvents || []).filter(
            id => (typeof id === 'object' ? id._id : id) !== eventId
          )
        };
      });
      return res.data;
    }
    throw new Error(res.data.message || 'Failed to cancel registration');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isRegisteredForEvent,
        registerEvent,
        cancelEvent,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
