import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../ui/Loading';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = [] 
}) => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <Loading />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user's role isn't included, redirect to appropriate dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'User':
        return <Navigate to="/user/dashboard" replace />;
      case 'Staff':
        return <Navigate to="/staff/dashboard" replace />;
      case 'Admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If authenticated and authorized, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;