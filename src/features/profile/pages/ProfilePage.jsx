import { useAuth } from '@/features/auth/hooks/useAuth';
import { PleaseLogin } from '@/features/auth/components/PleaseLogin';

export function ProfilePage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <PleaseLogin message="Login to view and edit your profile" />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="text-muted-foreground">Profile page coming soon...</p>
    </div>
  );
}
