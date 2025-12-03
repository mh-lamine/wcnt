import { Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { RequireProvider } from "@/features/auth/components/RequireProvider";
import PWABadge from "./PWABadge";

// Placeholder pages - will be created in next phases
function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Browse Providers</h1>
      <p className="text-muted-foreground">Provider list coming soon...</p>
    </div>
  );
}

function MyBookingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <p className="text-muted-foreground">Bookings list coming soon...</p>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Provider Dashboard</h1>
      <p className="text-muted-foreground">Dashboard coming soon...</p>
    </div>
  );
}

function ServicesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">My Services</h1>
      <p className="text-muted-foreground">
        Services management coming soon...
      </p>
    </div>
  );
}

function SchedulePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">My Schedule</h1>
      <p className="text-muted-foreground">
        Schedule management coming soon...
      </p>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="text-muted-foreground">Profile page coming soon...</p>
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes with layout */}
        <Route element={<RootLayout />}>
          {/* Customer routes */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <RequireAuth>
                <MyBookingsPage />
              </RequireAuth>
            }
          />

          {/* Provider routes */}
          <Route
            path="/dashboard"
            element={
              <RequireProvider>
                <DashboardPage />
              </RequireProvider>
            }
          />
          <Route
            path="/services"
            element={
              <RequireProvider>
                <ServicesPage />
              </RequireProvider>
            }
          />
          <Route
            path="/schedule"
            element={
              <RequireProvider>
                <SchedulePage />
              </RequireProvider>
            }
          />

          {/* Shared routes */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <PWABadge />
    </>
  );
}

export default App;
