import { Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { RequireProvider } from "@/features/auth/components/RequireProvider";
import { HomePage } from "@/features/salons/pages/HomePage";
import { MyBookingsPage } from "@/features/bookings/pages/MyBookingsPage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ServicesPage } from "@/features/services/pages/ServicesPage";
import { SchedulePage } from "@/features/schedule/pages/SchedulePage";
import PWABadge from "./PWABadge";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes with layout */}
        <Route element={<RootLayout />}>
          {/* Public customer routes */}
          <Route path="/" element={<HomePage />} />

          {/* Customer routes with auth gate inside */}
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Provider routes - fully protected */}
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
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <PWABadge />
    </>
  );
}

export default App;
