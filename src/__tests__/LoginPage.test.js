import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { login } from '../stores/authStore';
import LoginPage from '../components/LoginPage';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../stores/authStore', () => ({
  login: jest.fn(),
}));

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login form with all elements', () => {
    renderLoginPage();

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    expect(screen.getByText(/demo access/i)).toBeInTheDocument();
  });

  test('shows error when submitting empty form', async () => {
    renderLoginPage();

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText('Please fill in all fields')
    ).toBeInTheDocument();
  });

  test('shows error with invalid email format', async () => {
    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), 'invalidemail');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(
      await screen.findByText('Please enter a valid email address')
    ).toBeInTheDocument();
  });

  test('toggles password visibility when clicking eye icon', async () => {
    renderLoginPage();

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const visibilityToggle = screen.getByRole('button', {
      name: '',
    });
    fireEvent.click(visibilityToggle);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('shows demo credentials when clicking demo access', async () => {
    renderLoginPage();

    const demoButton = screen.getByText(/demo access/i);
    fireEvent.click(demoButton);

    expect(await screen.findByText('Demo Credentials')).toBeInTheDocument();
    expect(screen.getByText(/default@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/password123/)).toBeInTheDocument();
  });

  test('successfully logs in with valid credentials', async () => {
    const testUser = { email: 'test@example.com', password: 'password123' };
    localStorage.setItem('users', JSON.stringify([testUser]));

    renderLoginPage();

    await userEvent.type(screen.getByLabelText(/email/i), testUser.email);
    await userEvent.type(screen.getByLabelText(/password/i), testUser.password);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: testUser.email });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('fills form with demo credentials when clicking demo access', () => {
    renderLoginPage();

    fireEvent.click(screen.getByText(/demo access/i));

    expect(screen.getByLabelText(/email/i)).toHaveValue('default@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
  });
});
