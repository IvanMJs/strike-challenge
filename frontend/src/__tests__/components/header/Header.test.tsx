import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../../../components/header/Header';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Header', () => {
  const mockNavigate = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders title correctly', () => {
    (useAuth as any).mockReturnValue({ user: null, logout: mockLogout });
    render(<Header />);
    expect(screen.getByText('Vulnerability Management')).toBeInTheDocument();
  });

  it('displays user info when user is logged in', () => {
    const mockUser = { username: 'testuser', role: 'admin' };
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });
    
    render(<Header />);
    
    expect(screen.getByText(`Welcome, ${mockUser.username} (${mockUser.role})`)).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('does not display user info when user is not logged in', () => {
    (useAuth as any).mockReturnValue({ user: null, logout: mockLogout });
    
    render(<Header />);
    
    expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('handles logout correctly', () => {
    const mockUser = { username: 'testuser', role: 'admin' };
    (useAuth as any).mockReturnValue({ user: mockUser, logout: mockLogout });
    
    render(<Header />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
