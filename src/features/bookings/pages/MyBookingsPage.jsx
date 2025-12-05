import { useAuth } from '@/features/auth/hooks/useAuth';
import { PleaseLogin } from '@/features/auth/components/PleaseLogin';

export function MyBookingsPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PleaseLogin message="Connectez-vous ou créez un compte pour consulter vos réservations." />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <p className="text-muted-foreground">Bookings list coming soon...</p>
    </div>
  );
}
