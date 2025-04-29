import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, registerUser, getProfile } from '../services/authService';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  isVerified: boolean;
  verificationStatus: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Validate token and set user
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp && decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
          setUser(null);
        } else {
          // Fetch user profile with token
          fetchUserProfile();
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { token, user } = await loginUser(email, password);
      localStorage.setItem('token', token);
      setUser(user);

      // Redirect based on role
      if (user.role === 'User') navigate('/user/dashboard');
      else if (user.role === 'Staff') navigate('/staff/dashboard');
      else if (user.role === 'Admin') navigate('/admin/dashboard');
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      await registerUser(userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    toast.info('You have been logged out.');
  };

  const checkAuth = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};