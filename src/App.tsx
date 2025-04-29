import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Loading from './components/ui/Loading';
import { useAuth } from './context/AuthContext';

// Lazy-loaded components for better performance
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));
const StaffDashboard = lazy(() => import('./pages/staff/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ComplaintForm = lazy(() => import('./pages/complaints/ComplaintForm'));
const ComplaintDetail = lazy(() => import('./pages/complaints/ComplaintDetail'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={user ? getDashboardByRole(user.role) : <Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Protected routes for all authenticated users */}
          <Route element={<ProtectedRoute allowedRoles={['User', 'Staff', 'Admin']} />}>
            <Route path="profile" element={<Profile />} />
            <Route path="complaints/:id" element={<ComplaintDetail />} />
          </Route>

          {/* User-specific routes */}
          <Route element={<ProtectedRoute allowedRoles={['User']} />}>
            <Route path="user/dashboard" element={<UserDashboard />} />
            <Route path="complaints/new" element={<ComplaintForm />} />
          </Route>

          {/* Staff-specific routes */}
          <Route element={<ProtectedRoute allowedRoles={['Staff']} />}>
            <Route path="staff/dashboard" element={<StaffDashboard />} />
          </Route>

          {/* Admin-specific routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

// Helper function to return the correct dashboard based on user role
function getDashboardByRole(role: string) {
  switch (role) {
    case 'User':
      return <UserDashboard />;
    case 'Staff':
      return <StaffDashboard />;
    case 'Admin':
      return <AdminDashboard />;
    default:
      return <Login />;
  }
}

export default App;