import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  Home,
  Calendar,
  User,
  LayoutDashboard,
  Clock,
  HandHelping,
  LogIn,
} from "lucide-react";

export function BottomNav() {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Anonymous user navigation
  const anonymousNavItems = [
    { path: "/", icon: Home, label: "Accueil" },
    { path: "/my-bookings", icon: Calendar, label: "Réservations" },
    { path: "/login", icon: LogIn, label: "Connexion" },
  ];

  // Customer navigation (authenticated)
  const customerNavItems = [
    { path: "/", icon: Home, label: "Accueil" },
    { path: "/my-bookings", icon: Calendar, label: "Réservations" },
    { path: "/profile", icon: User, label: "Profil" },
  ];

  // Provider navigation
  const salonNavItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/services", icon: HandHelping, label: "Services" },
    { path: "/schedule", icon: Clock, label: "Horaires" },
    { path: "/settings", icon: User, label: "Profil" },
  ];

  // Determine which nav items to show
  let navItems;
  if (!isAuthenticated) {
    navItems = anonymousNavItems;
  } else if (role === "customers") {
    navItems = customerNavItems;
  } else {
    navItems = salonNavItems;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-[0_-4px_12px_rgba(0,0,0,0.2)] z-50"
    >
      <div className="flex bg-brand/10 justify-around items-center h-20 px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
              isActive(path)
                ? "text-brand"
                : "text-muted-foreground hover:text-foreground"
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
