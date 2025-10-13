import React, { createContext, useState, useContext } from 'react';
import UserAvatar from '../assets/user-avatar.jpg';

const fakeUsers = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123',
    name: 'Leon S. Kennedy',
    avatar: UserAvatar,
  },
];

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    const foundUser = fakeUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;