import { createBrowserRouter } from "react-router-dom";

import { HomePage } from "@/pages/home/home-page";
import { LoginPage } from "@/pages/auth/login-page";
import { RegisterPage } from "@/pages/auth/register-page";
import { CheckEmailPage } from "@/pages/auth/check-email-page";
import { DashboardPage } from "@/pages/dashboard/dashboard-page";

import { ProtectedRoute } from "@/components/auth/protected-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/check-email",
    element: <CheckEmailPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;
