import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, fetchMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('portal_jwt_token');
      if (token) {
        try {
          const res = await fetchMe();
          if (res.success) {
            setUser(res.user);
          } else {
            localStorage.removeItem('portal_jwt_token');
          }
        } catch (err) {
          localStorage.removeItem('portal_jwt_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await loginUser({ email, password });
      if (res.success) {
        localStorage.setItem('portal_jwt_token', res.token);
        setUser(res.user);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('portal_jwt_token');
    setUser(null);
  };

  const isAdmin = user?.role === 'Admin' || user?.roleName === 'Admin';

  const hasAppAccess = (appKey) => {
    if (isAdmin) return true;
    return user?.allowedApps?.includes(appKey);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAdmin, hasAppAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
