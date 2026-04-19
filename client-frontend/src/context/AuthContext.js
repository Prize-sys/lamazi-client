import React, { createContext, useContext, useState } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('mc_user');
    return u ? JSON.parse(u) : null;
  });

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password, role: 'client' });
    const { token, user: userData } = res.data;
    localStorage.setItem('mc_token', token);
    localStorage.setItem('mc_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const register = async (data) => {
    const res = await authAPI.register({ ...data, role: 'client' });
    const { token, user: userData } = res.data;
    localStorage.setItem('mc_token', token);
    localStorage.setItem('mc_user', JSON.stringify(userData));
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
