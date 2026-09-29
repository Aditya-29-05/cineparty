import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cineparty_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cineparty_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleLoginSuccess = (authToken, authUser) => {
    localStorage.setItem('cineparty_token', authToken);
    setToken(authToken);
    setUser(authUser);
  };

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.token) {
      handleLoginSuccess(res.token, res.user);
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    if (res.success && res.token) {
      handleLoginSuccess(res.token, res.user);
    }
    return res;
  };

  const googleLogin = async (credential) => {
    const res = await authService.googleAuth(credential);
    if (res.success && res.token) {
      handleLoginSuccess(res.token, res.user);
    }
    return res;
  };

  const handleLogout = () => {
    localStorage.removeItem('cineparty_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        googleLogin,
        logout: handleLogout,
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
