import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import * as authService from '../../services/authService';
import { storage } from '../../utils/storage';

// Mock the storage module
vi.mock('../../utils/storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock the authService module
vi.mock('../../services/authService', () => ({
  login: vi.fn(),
  logout: vi.fn(),
}));

// Test component that uses the auth context
function TestComponent() {
  const { user, login, logout, isAdmin } = useAuth();
  return (
    <div>
      <div data-testid="user-info">
        {user ? JSON.stringify(user) : 'no user'}
      </div>
      <div data-testid="is-admin">{isAdmin ? 'true' : 'false'}</div>
      <button onClick={() => login('test', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides null user and false isAdmin by default', () => {
    (storage.get as jest.Mock).mockReturnValue(null);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user-info')).toHaveTextContent('no user');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
  });

  it('loads user from storage on initialization', () => {
    const mockUser = {
      id: '1',
      username: 'test',
      role: 'admin',
    };
    (storage.get as jest.Mock).mockReturnValue(JSON.stringify(mockUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user-info')).toHaveTextContent(JSON.stringify(mockUser));
    expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
  });

  it('handles login success', async () => {
    const mockUser = {
      id: '1',
      username: 'test',
      role: 'user',
    };
    
    (authService.login as jest.Mock).mockResolvedValue({ user: mockUser });
    (storage.get as jest.Mock).mockReturnValue(null);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });
    
    expect(authService.login).toHaveBeenCalledWith({
      username: 'test',
      password: 'password',
    });
    expect(screen.getByTestId('user-info')).toHaveTextContent(JSON.stringify(mockUser));
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
  });

  it('handles login failure', async () => {
    (storage.get as jest.Mock).mockReturnValue(null);
    (authService.login as jest.Mock).mockRejectedValue(new Error('Login failed'));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await act(async () => {
      await userEvent.click(screen.getByText('Login'));
    });
    
    expect(screen.getByTestId('user-info')).toHaveTextContent('no user');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
  });

  it('handles logout', async () => {
    const mockUser = {
      id: '1',
      username: 'test',
      role: 'admin',
    };
    (storage.get as jest.Mock).mockReturnValue(JSON.stringify(mockUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await act(async () => {
      await userEvent.click(screen.getByText('Logout'));
    });
    
    expect(authService.logout).toHaveBeenCalled();
    expect(screen.getByTestId('user-info')).toHaveTextContent('no user');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
});
