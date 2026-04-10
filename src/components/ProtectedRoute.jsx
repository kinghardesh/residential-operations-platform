import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role && user?.role !== role) {
    const home =
      user.role === 'resident'
        ? '/resident/dashboard'
        : user.role === 'owner'
          ? '/owner/dashboard'
          : '/admin/dashboard';
    return <Navigate to={home} replace />;
  }
  return children;
}
