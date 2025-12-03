import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';

export function Header() {
  const { isAuthenticated, role, logout, auth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand">
          WeConnect
        </Link>

        <nav className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          ) : (
            <>
              {role === 'customers' && (
                <>
                  <Link to="/">
                    <Button variant="ghost">Browse Providers</Button>
                  </Link>
                  <Link to="/my-bookings">
                    <Button variant="ghost">My Bookings</Button>
                  </Link>
                </>
              )}

              {role === 'providers' && (
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}

              <Link to="/profile">
                <Button variant="ghost">{auth?.name || 'Profile'}</Button>
              </Link>

              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
