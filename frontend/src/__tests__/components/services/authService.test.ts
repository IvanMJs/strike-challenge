import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login, logout, checkAuth, getUser } from '../../../services/authService';
import { storage } from '../../../utils/storage';
import type { Mock } from 'vitest';

vi.mock('../../../utils/storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  }
}));

const mockStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
} as unknown as Storage;

Object.defineProperty(global, 'localStorage', {
  value: mockStorage,
  writable: true,
});

const mockFetch = vi.fn();
global.fetch = mockFetch;

const API_URL = 'http://localhost:3000';

describe('authService', () => {  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('login', () => {
    const loginData = {
      username: 'testuser',
      password: 'testpass',
    };

    it('should successfully log in and store token and user data', async () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          id: '1',
          username: 'testuser',
          role: 'user',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await login(loginData);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      expect(storage.set).toHaveBeenCalledWith('token', mockResponse.token);
      expect(storage.set).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when login fails', async () => {
      const errorMessage = 'Invalid credentials';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: errorMessage }),
      });

      await expect(login(loginData)).rejects.toThrow(errorMessage);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(login(loginData)).rejects.toThrow('Network error');
    });
  });

  describe('logout', () => {
    it('should clear storage on logout', () => {
      logout();

      expect(storage.remove).toHaveBeenCalledWith('token');
      expect(storage.remove).toHaveBeenCalledWith('user');
    });
  });

  describe('checkAuth', () => {
    it('should return response when token is valid', async () => {
      const mockResponse = {
        token: 'test-token',
        user: { id: '1', username: 'test', role: 'user' }
      };
      (mockStorage.getItem as Mock).mockReturnValue('test-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await checkAuth();
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/api/auth/verify`, {
        headers: {
          'Authorization': 'Bearer test-token',
        },
      });
    });

    it('should return null when token verification fails', async () => {
      (mockStorage.getItem as Mock).mockReturnValue('test-token');
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      const result = await checkAuth();
      expect(result).toBeNull();
      expect(mockStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('should return null when token does not exist', async () => {
      (mockStorage.getItem as Mock).mockReturnValue(null);

      const result = await checkAuth();
      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      (mockStorage.getItem as Mock).mockReturnValue('test-token');
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await checkAuth();
      expect(result).toBeNull();
      expect(mockStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('getUser', () => {
    it('should return user object when it exists', () => {
      const user = { id: '1', username: 'testuser', role: 'user' };
      (storage.get as Mock).mockReturnValue(JSON.stringify(user));

      expect(getUser()).toEqual(user);
      expect(storage.get).toHaveBeenCalledWith('user');
    });

    it('should return null when user data does not exist', () => {
      (storage.get as Mock).mockReturnValue(null);

      expect(getUser()).toBeNull();
      expect(storage.get).toHaveBeenCalledWith('user');
    });

    it('should return null when user data is invalid JSON', () => {
      (storage.get as Mock).mockReturnValue('invalid-json');

      expect(getUser()).toBeNull();
      expect(storage.get).toHaveBeenCalledWith('user');
    });
  });
});
