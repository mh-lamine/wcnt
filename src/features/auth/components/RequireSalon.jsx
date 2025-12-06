import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RequireSalon({ children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'salons') {
    return <Navigate to="/" replace />;
  }

  return children;
}
