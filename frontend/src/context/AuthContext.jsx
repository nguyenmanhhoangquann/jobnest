import React, { createContext, useContext, useState } from 'react';
import authApi from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('jn_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('jn_token') || null);

  const login = async (username, password) => {
    const res = await authApi.login({ username, password });
    localStorage.setItem('jn_token', res.token);
    localStorage.setItem('jn_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (formData) => {
    const res = await authApi.register(formData);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('jn_token');
    localStorage.removeItem('jn_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuth: !!user,
        isAuthenticated: !!user,
        isCandidate: user?.role === 'CANDIDATE',
        isEmployer: user?.role === 'EMPLOYER',
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      isAuth: false,
      isAuthenticated: false,
      isCandidate: false,
      isEmployer: false,
      login: () => {},
      register: () => {},
      logout: () => {},
    };
  }
  return ctx;
}
