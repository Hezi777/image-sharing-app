// Auth provider - manages user authentication state using React Context
// Handles login/logout, persists auth to localStorage, and sets axios headers

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export interface UserShape {
  id: number | string;
  username: string;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserShape | null;
  login: (token: string, userData: UserShape) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access auth context - must be used within AuthProvider
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserShape | null>(null);

  // Restore authentication from localStorage on app startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Store auth data and set axios header for API requests
  const login = (token: string, userData: UserShape) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Clear auth data and remove axios header
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = useMemo(() => ({ isAuthenticated, user, login, logout }), [isAuthenticated, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
