import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isAuth: false,
      login: () => {},
      logout: () => {},
    };
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jn_user'));
    } catch {
      return null;
    }
  });

  const login = useCallback(({ token, user }) => {
    localStorage.setItem('jn_token', token);
    localStorage.setItem('jn_user', JSON.stringify(user));
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jn_token');
    localStorage.removeItem('jn_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuth: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
