import { useAuth } from '@/features/auth/hooks/useAuth';
import { PleaseLogin } from '@/features/auth/components/PleaseLogin';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function ProfilePage() {
  const { isAuthenticated, auth, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <PleaseLogin message="Login to view and edit your profile" />;
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('You have been logged out successfully');
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Account Information</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{auth?.email || 'Not available'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {auth?.firstName && auth?.lastName
                  ? `${auth.firstName} ${auth.lastName}`
                  : auth?.username || 'Not available'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Account Type</p>
              <p className="font-medium capitalize">{auth?.collectionName || 'Customer'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {auth?.created
                  ? new Date(auth.created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Not available'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Account Actions</h2>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast.info('Edit profile feature coming soon')}
            >
              Edit Profile
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast.info('Change password feature coming soon')}
            >
              Change Password
            </Button>

            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
