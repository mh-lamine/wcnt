import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RequireProvider({ children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'providers') {
    return <Navigate to="/" replace />;
  }

  return children;
}
