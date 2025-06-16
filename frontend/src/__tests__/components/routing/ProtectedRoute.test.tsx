import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProtectedRoute } from '../../../components/routing/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  const mockLocation = { pathname: '/test' };
  const TestComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    (useLocation as any).mockReturnValue(mockLocation);
    (Navigate as any).mockImplementation(({ to }: { to: string }) => <div>Redirected to {to}</div>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    (useAuth as any).mockReturnValue({ user: { username: 'test' }, isAdmin: false });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    (useAuth as any).mockReturnValue({ user: null, isAdmin: false });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Redirected to /login')).toBeInTheDocument();
  });

  it('allows access to admin routes for admin users', () => {
    (useAuth as any).mockReturnValue({ user: { username: 'admin' }, isAdmin: true });

    render(
      <ProtectedRoute requiredRole="admin">
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects non-admin users from admin routes', () => {
    (useAuth as any).mockReturnValue({ user: { username: 'user' }, isAdmin: false });

    render(
      <ProtectedRoute requiredRole="admin">
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Redirected to /')).toBeInTheDocument();
  });
});
