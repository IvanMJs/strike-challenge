import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../../../components/login/LoginForm';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as object;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
  }),
}));

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockReset();
  });

  it('renders login form with all required elements', () => {
    renderLoginForm();

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('updates input values on user input', () => {
    renderLoginForm();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('handles successful login', async () => {
    mockLogin.mockResolvedValueOnce({ token: 'test-token', user: { username: 'testuser', role: 'USER' } });
    renderLoginForm();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
  });
  it('handles login failure', async () => {
    mockLogin.mockResolvedValueOnce(false);
    renderLoginForm();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles login error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('An error occurred'));
    renderLoginForm();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('An error occurred during login')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('disables login button while logging in', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 100)));
    renderLoginForm();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });    fireEvent.click(loginButton);

    expect(loginButton).toBeDisabled();
    expect(loginButton).toHaveTextContent('Logging in...');

    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
    });
  });

  it('validates empty fields on submit', async () => {
    renderLoginForm();

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(mockLogin).not.toHaveBeenCalled();
  });
  it('clears error when user starts typing', async () => {
    mockLogin.mockResolvedValueOnce(false);
    renderLoginForm();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    expect(screen.queryByText('Invalid username or password')).not.toBeInTheDocument();
  });
});
