import { useAuth } from "@/features/auth/hooks/useAuth";
import { PleaseLogin } from "@/features/auth/components/PleaseLogin";
import { useNavigate } from "react-router-dom";

export function MyBookingsPage() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <PleaseLogin message="Connectez-vous ou créez un compte pour consulter vos réservations." />
    );
  }

  if (role === "salons") {
    navigate("/dashboard")
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <p className="text-muted-foreground">Bookings list coming soon...</p>
    </div>
  );
}
