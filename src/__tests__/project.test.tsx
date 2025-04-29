import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Register from '../pages/auth/Register';
import ComplaintForm from '../pages/complaints/ComplaintForm';
import '@testing-library/jest-dom';

// Test component to test the useAuth hook
const TestAuthComponent = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <div>
          <p>Logged in as {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button
          onClick={() => login('user@example.com', 'password123')}
        >
          Login
        </button>
      )}
    </div>
  );
};

afterEach(() => {
  vi.restoreAllMocks(); // Restore all mocks after each test
  cleanup(); // Clean up rendered components
});

describe('AuthContext Tests', () => {
  test('should log in a user successfully', async () => {
    const mockUser = { email: 'user@example.com', name: 'John Doe', role: 'User' };
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ token: 'mockToken', user: mockUser }),
      ok: true,
    } as Response);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestAuthComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const loginButton = screen.getByText(/Login/i);
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(screen.getByText(/Logged in as user@example.com/i)).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBe('mockToken');
  });

  test('should display an error for invalid credentials', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ message: 'Invalid credentials' }),
      ok: false,
    } as Response);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestAuthComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const loginButton = screen.getByText(/Login/i);
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(screen.getByText(/Login failed. Please try again./i)).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('should log out a user successfully', async () => {
    const mockUser = { email: 'user@example.com', name: 'John Doe', role: 'User' };
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ token: 'mockToken', user: mockUser }),
      ok: true,
    } as Response);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestAuthComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const loginButton = screen.getByText(/Login/i);
    await act(async () => {
      fireEvent.click(loginButton);
    });

    const logoutButton = screen.getByText(/Logout/i);
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(screen.queryByText(/Logged in as user@example.com/i)).not.toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
  });
});

describe('Registration Tests', () => {
  const renderWithProviders = () =>
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );

  test('should display validation errors for required fields', async () => {
    renderWithProviders();

    fireEvent.click(await screen.findByRole('button', { name: /Create Account/i }));

    const errors = await screen.findAllByText(/is required/i);
    expect(errors).toHaveLength(5); // Assuming 5 required fields
  });

  test('should display an error if passwords do not match', async () => {
    renderWithProviders();

    fireEvent.input(screen.getByLabelText('Password', { selector: 'input' }), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText('Confirm Password', { selector: 'input' }), { target: { value: 'differentPassword' } });

    fireEvent.click(await screen.findByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('should submit the form with valid data', async () => {
    const mockRegisterUser = vi.fn().mockResolvedValueOnce({});
    vi.spyOn(require('../context/AuthContext'), 'useAuth').mockReturnValue({
      register: mockRegisterUser,
    });

    renderWithProviders();

    fireEvent.input(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.input(screen.getByLabelText(/Username/i), { target: { value: 'johndoe' } });
    fireEvent.input(screen.getByLabelText('Password', { selector: 'input' }), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText('Confirm Password', { selector: 'input' }), { target: { value: 'password123' } });

    fireEvent.click(await screen.findByRole('button', { name: /Create Account/i }));

    expect(mockRegisterUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      password: 'password123',
      userType: 'User',
    });
  });
});

describe('Register Component Tests', () => {
  const renderRegister = () =>
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );

  test('should display an error if passwords do not match', async () => {
    renderRegister();

    // Fill in the password and confirmPassword fields
    fireEvent.input(screen.getByLabelText('Password', { selector: 'input' }), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText('Confirm Password', { selector: 'input' }), { target: { value: 'differentPassword' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Check for the error message
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('should display validation errors for required fields', async () => {
    renderRegister();

    // Submit the form without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Check for validation error messages
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Please confirm your password/i)).toBeInTheDocument();
    expect(true).toBe(true);
  });
});

describe('Complaint Form Tests', () => {
  const renderComplaintForm = () =>
    render(
      <BrowserRouter>
        <AuthProvider>
          <ComplaintForm />
        </AuthProvider>
      </BrowserRouter>
    );

  test('should display validation errors for required fields', async () => {
    renderComplaintForm();

    await screen.findByRole('button', { name: /Submit Complaint/i });
    fireEvent.click(screen.getByRole('button', { name: /Submit Complaint/i }));

    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Description is required/i)).toBeInTheDocument();
    expect(true).toBe(true);
  });

  test('should submit the form with valid data', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ message: 'Complaint submitted successfully' }),
      ok: true,
    } as Response);

    renderComplaintForm();

    await screen.findByLabelText(/Title/i);
    fireEvent.input(screen.getByLabelText(/Title/i), { target: { value: 'Test Complaint' } });
    fireEvent.input(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Department/i), { target: { value: 'd1' } });

    await screen.findByRole('button', { name: /Submit Complaint/i });
    fireEvent.click(screen.getByRole('button', { name: /Submit Complaint/i }));

    expect(await screen.findByText(/Complaint submitted successfully/i)).toBeInTheDocument();
    expect(true).toBe(true);
  });
});