import { Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { RequireSalon } from "@/features/auth/components/RequireSalon";
import { HomePage } from "@/features/salons/pages/HomePage";
import { MyBookingsPage } from "@/features/bookings/pages/MyBookingsPage";
import { CustomerProfilePage } from "@/features/account/pages/CustomerProfilePage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ServicesPage } from "@/features/services/pages/ServicesPage";
import { SchedulePage } from "@/features/schedule/pages/SchedulePage";
import { SalonProfilePage } from "./features/account/pages/SalonProfilePage";
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
          <Route path="/profile" element={<CustomerProfilePage />} />

          {/* Provider routes - fully protected */}
          <Route
            path="/dashboard"
            element={
              <RequireSalon>
                <DashboardPage />
              </RequireSalon>
            }
          />
          <Route
            path="/services"
            element={
              <RequireSalon>
                <ServicesPage />
              </RequireSalon>
            }
          />
          <Route
            path="/schedule"
            element={
              <RequireSalon>
                <SchedulePage />
              </RequireSalon>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireSalon>
                <SalonProfilePage />
              </RequireSalon>
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
