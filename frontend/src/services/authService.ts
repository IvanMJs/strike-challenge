import { storage } from '../utils/storage';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface User {
  id: string;
  username: string;
  role: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getUser = (): User | null => {
  const token = storage.get('token');
  const userStr = storage.get('user');
  
  if (!token || !userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch {
    storage.remove('token');
    storage.remove('user');
    return null;
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    mode: 'cors',
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error('Invalid credentials');
  }
  const data = await response.json();
  storage.set('token', data.token);
  storage.set('user', JSON.stringify(data.user));
  return data;
};

export const logout = (): void => {
  storage.remove('token');
  storage.remove('user');
};

export const checkAuth = async (): Promise<AuthResponse | null> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      localStorage.removeItem('token');
      return null;
    }

    return response.json();
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};

export const register = async (userData: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};
