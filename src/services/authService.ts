import axios from 'axios';
import { API_URL } from '../config/constants';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const loginUser = async (email: string, password: string) => {
  try {
    // For now, mock the API call
    // In a real app, this would be: const { data } = await api.post('/auth/login', { email, password });
    
    // Mock response for demo purposes
    const mockRoles = {
      'user@example.com': 'User',
      'staff@example.com': 'Staff',
      'admin@example.com': 'Admin'
    };
    
    const role = mockRoles[email as keyof typeof mockRoles] || 'User';
    
    // Simulate API response
    const data = {
      token: 'mock-jwt-token',
      user: {
        id: '123',
        email,
        username: email.split('@')[0],
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        role,
        isVerified: true,
        verificationStatus: 'Verified'
      }
    };
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to login');
  }
};

export const registerUser = async (userData: any) => {
  try {
    // For now, mock the API call
    // In a real app, this would be: await api.post('/auth/register', userData);
    
    // Mock successful registration
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
};

export const getProfile = async () => {
  try {
    // For now, mock the API call
    // In a real app, this would be: const { data } = await api.get('/auth/profile');
    
    // Get user data from local storage if needed
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    
    // Mock user data for demo
    return {
      id: '123',
      email: 'user@example.com',
      username: 'user',
      name: 'User',
      role: 'User',
      isVerified: true,
      verificationStatus: 'Verified'
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get profile');
  }
};

export default api;