import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Home, Calendar, User, LayoutDashboard, Briefcase, Clock, HandHelping } from 'lucide-react';

export function BottomNav() {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  // Customer navigation
  const customerNavItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/my-bookings', icon: Calendar, label: 'Réservations' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  // Provider navigation
  const providerNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/services', icon: HandHelping, label: 'Services' },
    { path: '/schedule', icon: Clock, label: 'Horaires' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  const navItems = role === 'customers' ? customerNavItems : providerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
              isActive(path)
                ? 'text-brand'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
