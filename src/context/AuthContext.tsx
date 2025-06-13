import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'admin' | 'user';

interface User {
  username: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS = {
  admin: { username: 'admin', password: 'admin123', role: 'admin' as Role },
  user: { username: 'user', password: 'user123', role: 'user' as Role },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (username: string, password: string) => {
    const lowercaseUsername = username.toLowerCase();
    const userEntry = Object.values(USERS).find(
      (u) => u.username === lowercaseUsername && u.password === password
    );

    if (userEntry) {
      const userData: User = {
        username: userEntry.username,
        role: userEntry.role,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
