import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit,
    formState: { errors } 
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      await login(data.email, data.password);
      // Redirect is handled in the AuthContext
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <AlertCircle size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to SCMS</h1>
          <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email',
                },
              })}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
              Create an account
            </Link>
          </p>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6">
          <p className="text-sm text-gray-500 text-center">
            For demo purposes, use:
          </p>
          <div className="mt-2 grid gap-2 text-xs text-gray-600">
            <p><strong>User:</strong> user@example.com / password</p>
            <p><strong>Staff:</strong> staff@example.com / password</p>
            <p><strong>Admin:</strong> admin@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;