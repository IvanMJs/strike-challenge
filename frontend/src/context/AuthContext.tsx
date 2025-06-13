import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';
import { storage } from '../utils/storage';

type Role = 'admin' | 'user';

interface User {
  id: string;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {  const [user, setUser] = useState<User | null>(() => {
    const userStr = storage.get('user');
    if (!userStr) return null;
    try {
      const userData = JSON.parse(userStr);
      return userData ? { ...userData, role: userData.role as Role } : null;
    } catch {
      storage.remove('user');
      storage.remove('token');
      return null;
    }
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      const userData = response.user as User;
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  const logout = () => {
    setUser(null);
    authService.logout();
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
